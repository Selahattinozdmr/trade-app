"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ConversationList } from "@/features/messages/components/ConversationList";
import type { Conversation, Message } from "@/types/app";

interface ConversationListClientWrapperProps {
  initialConversations: Conversation[];
  currentUserId: string;
  selectedUserId?: string;
}

export function ConversationListClientWrapper({
  initialConversations,
  currentUserId,
  selectedUserId,
}: ConversationListClientWrapperProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const router = useRouter();

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  useEffect(() => {
    // Create Supabase client for real-time
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Subscribe to new conversations
    const conversationChannel = supabase
      .channel(`user_conversations:${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
          filter: `user1_id=eq.${currentUserId}`,
        },
        () => {
          // Refresh when new conversation is created
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversations",
          filter: `user2_id=eq.${currentUserId}`,
        },
        () => {
          // Refresh when new conversation is created
          router.refresh();
        }
      )
      .subscribe();

    // Subscribe to new messages to update conversation list
    const messageChannel = supabase
      .channel(`user_messages:${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new as Message;

          // Update the conversation list to show the new message
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id === newMessage.conversation_id) {
                // Update latest message and unread count
                const updatedConv = { ...conv };
                updatedConv.latest_message = newMessage;

                // Update unread count if message is not from current user
                if (newMessage.sender_id !== currentUserId) {
                  updatedConv.unread_count = (conv.unread_count || 0) + 1;
                }

                return updatedConv;
              }
              return conv;
            })
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const updatedMessage = payload.new as Message;

          // Update conversation if message was marked as read
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id === updatedMessage.conversation_id) {
                const updatedConv = { ...conv };

                // If message was marked as read by current user, update unread count
                if (
                  updatedMessage.read_at &&
                  updatedMessage.sender_id !== currentUserId
                ) {
                  updatedConv.unread_count = Math.max(
                    0,
                    (conv.unread_count || 0) - 1
                  );
                }

                return updatedConv;
              }
              return conv;
            })
          );
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      conversationChannel.unsubscribe();
      messageChannel.unsubscribe();
    };
  }, [currentUserId, router]);

  return (
    <ConversationList
      conversations={conversations}
      currentUserId={currentUserId}
      {...(selectedUserId && { selectedUserId })}
    />
  );
}
