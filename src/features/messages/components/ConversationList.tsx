import Link from "next/link";
import type { Conversation, User } from "@/types/app";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { getDisplayName } from "@/utils/avatar";

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedUserId?: string;
}

function getConversationPartner(
  conversation: Conversation,
  currentUserId: string
): User | null {
  if (conversation.user1_id === currentUserId) {
    return conversation.user2 || null;
  }
  return conversation.user1 || null;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "şimdi";
  if (diffInMinutes < 60) return `${diffInMinutes} dk önce`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} sa önce`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} gün önce`;

  return date.toLocaleDateString("tr-TR");
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedUserId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-4">
        <div className="text-center">
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
          <p className="text-sm">Henüz konuşmanız yok</p>
          <p className="text-xs text-gray-400 mt-1">
            Bir ilan sahibiyle iletişime geçin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      {/* Mobile header - only show when no conversation is selected */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-gray-900">Konuşmalar</h2>
      </div>

      {/* Conversation list */}
      <div
        className="h-full overflow-y-auto bg-white"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 transparent",
        }}
      >
        {conversations.map((conversation) => {
          const partner = getConversationPartner(conversation, currentUserId);

          if (!partner) return null;

          const isSelected = selectedUserId === partner.id;
          const displayName = getDisplayName(partner);
          const hasUnread = (conversation.unread_count || 0) > 0;

          return (
            <Link
              key={conversation.id}
              href={`/messages/${partner.id}`}
              className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                isSelected ? "bg-orange-50 border-orange-200" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <UserAvatar user={partner} size="lg" />
                  {hasUnread && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {conversation.unread_count! > 9
                          ? "9+"
                          : conversation.unread_count}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-sm font-medium truncate ${
                        hasUnread ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {displayName}
                    </h3>
                    {conversation.latest_message && (
                      <span className="text-xs text-gray-500 ml-2">
                        {formatTimeAgo(conversation.latest_message.created_at)}
                      </span>
                    )}
                  </div>

                  {conversation.latest_message && (
                    <p
                      className={`text-sm truncate mt-1 ${
                        hasUnread
                          ? "text-gray-900 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {conversation.latest_message.sender_id ===
                        currentUserId && "Sen: "}
                      {conversation.latest_message.content}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
