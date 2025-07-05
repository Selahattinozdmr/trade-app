"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  // TODO: Add realtime subscription for new messages
  // This requires proper Supabase realtime configuration

  const handleMessageSent = () => {
    // Refresh the page to get updated messages and conversations
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
