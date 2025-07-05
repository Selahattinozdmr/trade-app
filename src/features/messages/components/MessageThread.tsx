"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { sendMessage, markMessagesAsRead } from "../actions";
import type { Message, User } from "@/types/app";

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  conversationId: string;
  partner: User;
  onMessageSent?: () => void;
}

function getDisplayName(user: User): string {
  // Priority: display_name > full_name > email prefix > user ID suffix
  if (user.display_name) return user.display_name;
  if (user.full_name) return user.full_name;
  if (user.email) {
    const emailParts = user.email.split("@");
    if (emailParts.length > 0 && emailParts[0]) return emailParts[0];
  }
  // Fallback to user ID suffix as last resort
  return `Kullanıcı ${user.id.slice(-4)}`;
}

function getAvatarUrl(user: User): string {
  return (
    user.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getDisplayName(user)
    )}&background=f97316&color=ffffff`
  );
}

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isYesterday) {
    return `Dün ${date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function MessageThread({
  messages,
  currentUserId,
  conversationId,
  partner,
  onMessageSent,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const partnerDisplayName = getDisplayName(partner);
  const partnerAvatarUrl = getAvatarUrl(partner);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when conversation is opened
    const markAsRead = async () => {
      await markMessagesAsRead(conversationId);
    };
    markAsRead();
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || isLoading) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsLoading(true);

    try {
      const result = await sendMessage({
        conversation_id: conversationId,
        content: messageContent,
      });

      if (result.success) {
        onMessageSent?.();
      } else {
        console.error("Failed to send message:", result.error);
        // Restore message if failed
        setNewMessage(messageContent);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore message if failed
      setNewMessage(messageContent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Image
            src={partnerAvatarUrl}
            alt={partnerDisplayName}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {partnerDisplayName}
            </h2>
            <p className="text-sm text-gray-500">Aktif</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm">Henüz mesaj yok</p>
            <p className="text-xs text-gray-400 mt-1">
              İlk mesajı gönder ve konuşmayı başlat
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-orange-100" : "text-gray-500"
                    }`}
                  >
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t border-gray-200 p-4"
      >
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className=" px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
