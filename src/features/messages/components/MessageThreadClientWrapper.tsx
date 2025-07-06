"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { MessageThread } from "@/features/messages/components/MessageThread";
import type { Message, User } from "@/types/app";

interface MessageThreadClientWrapperProps {
  initialMessages: Message[];
  currentUserId: string;
  conversationId: string;
  partner: User;
}

export function MessageThreadClientWrapper({
  initialMessages,
  currentUserId,
  conversationId,
  partner,
}: MessageThreadClientWrapperProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const router = useRouter();

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    // Create Supabase client for real-time
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Subscribe to new messages in this conversation
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            const exists = prev.some((msg) => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [conversationId]);

  const handleMessageSent = () => {
    // Refresh conversations list to update latest message and timestamps
    router.refresh();
  };

  return (
    <MessageThread
      messages={messages}
      currentUserId={currentUserId}
      conversationId={conversationId}
      partner={partner}
      onMessageSent={handleMessageSent}
    />
  );
}
