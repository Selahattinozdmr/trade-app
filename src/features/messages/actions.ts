"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Conversation, Message, SendMessageData, User } from "@/types/app";

// Helper function to get user data from their current session
async function getCurrentUserData(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email || "",
    created_at: user.created_at || "",
    full_name: user.user_metadata?.full_name,
    display_name: user.user_metadata?.display_name,
    phone: user.user_metadata?.phone,
    avatar_url: user.user_metadata?.avatar_url,
    user_metadata: user.user_metadata,
  };
}

// Helper function to fetch user data from auth.users table
async function fetchUserData(userId: string): Promise<User | null> {
  try {
    // Query the auth.users table using the admin client
    const { data: userData, error } =
      await supabaseAdmin.auth.admin.getUserById(userId);

    if (error || !userData.user) {
      console.error("Error fetching user data:", error);
      return null;
    }

    const user = userData.user;

    return {
      id: user.id,
      email: user.email || "",
      created_at: user.created_at || "",
      full_name: user.user_metadata?.full_name,
      display_name: user.user_metadata?.display_name,
      phone: user.user_metadata?.phone,
      // Prioritize custom avatar over regular avatar
      avatar_url:
        user.user_metadata?.custom_avatar_url || user.user_metadata?.avatar_url,
      user_metadata: user.user_metadata,
    };
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    return null;
  }
}

// Helper function to create a user object for other users (when we can't access their session)
function createBasicUserObject(userId: string, currentUser?: User): User {
  // If this is the current user, use their actual data
  if (currentUser && currentUser.id === userId) {
    return currentUser;
  }

  // For other users, create a basic object that will be enhanced by UI
  return {
    id: userId,
    email: "",
    created_at: new Date().toISOString(),
  };
}

// Get all conversations for a user
export async function getUserConversations(userId: string): Promise<{
  success: boolean;
  data?: Conversation[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const currentUser = await getCurrentUserData();

    if (!currentUser) {
      return { success: false, error: "Kullanıcı oturumu bulunamadı" };
    }

    // Get conversations without user joins - we'll handle user data separately
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        messages(
          id,
          content,
          created_at,
          sender_id,
          read_at
        )
      `
      )
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return { success: false, error: "Konuşmalar alınırken hata oluştu" };
    }

    if (!conversations || conversations.length === 0) {
      return { success: true, data: [] };
    }

    // Process conversations to include latest message and unread count
    const processedConversations: Conversation[] = [];

    for (const conv of conversations) {
      const messages = conv.messages || [];
      const latestMessage = messages.sort(
        (a: Message, b: Message) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      const unreadCount = messages.filter(
        (msg: Message) => msg.sender_id !== userId && !msg.read_at
      ).length;

      const result: Conversation = {
        id: conv.id,
        user1_id: conv.user1_id,
        user2_id: conv.user2_id,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        unread_count: unreadCount,
      };

      // Fetch actual user data from auth.users
      if (conv.user1_id !== userId) {
        result.user1 =
          (await fetchUserData(conv.user1_id)) ||
          createBasicUserObject(conv.user1_id, currentUser);
      }
      if (conv.user2_id !== userId) {
        result.user2 =
          (await fetchUserData(conv.user2_id)) ||
          createBasicUserObject(conv.user2_id, currentUser);
      }

      if (latestMessage) {
        result.latest_message = latestMessage;
      }

      processedConversations.push(result);
    }

    return { success: true, data: processedConversations };
  } catch (error) {
    console.error("Error in getUserConversations:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Konuşmalar alınırken hata oluştu",
    };
  }
}

// Get messages for a specific conversation
export async function getConversationMessages(conversationId: string): Promise<{
  success: boolean;
  data?: Message[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return { success: false, error: "Mesajlar alınırken hata oluştu" };
    }

    return { success: true, data: messages || [] };
  } catch (error) {
    console.error("Error in getConversationMessages:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Mesajlar alınırken hata oluştu",
    };
  }
}

// Send a message
export async function sendMessage(messageData: SendMessageData): Promise<{
  success: boolean;
  data?: Message;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Kimlik doğrulama gerekli" };
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: messageData.conversation_id,
        sender_id: user.id,
        content: messageData.content,
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return { success: false, error: "Mesaj gönderilirken hata oluştu" };
    }

    revalidatePath("/messages");
    return { success: true, data: message };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Mesaj gönderilirken hata oluştu",
    };
  }
}

// Get or create conversation with another user
export async function getOrCreateConversation(otherUserId: string): Promise<{
  success: boolean;
  data?: string; // conversation ID
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Kimlik doğrulama gerekli" };
    }

    // Use the database function to get or create conversation
    const { data, error } = await supabase.rpc("get_or_create_conversation", {
      current_user_id: user.id,
      other_user_id: otherUserId,
    });

    if (error) {
      console.error("Error getting/creating conversation:", error);
      return { success: false, error: "Konuşma oluşturulurken hata oluştu" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error("Error in getOrCreateConversation:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Konuşma oluşturulurken hata oluştu",
    };
  }
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Kimlik doğrulama gerekli" };
    }

    const { error } = await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .is("read_at", null);

    if (error) {
      console.error("Error marking messages as read:", error);
      return {
        success: false,
        error: "Mesajlar okundu olarak işaretlenirken hata oluştu",
      };
    }

    revalidatePath("/messages");
    return { success: true };
  } catch (error) {
    console.error("Error in markMessagesAsRead:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Mesajlar okundu olarak işaretlenirken hata oluştu",
    };
  }
}

// Get user info by ID (for conversation partner)
export async function getUserById(userId: string): Promise<{
  success: boolean;
  data?: User;
  error?: string;
}> {
  try {
    const currentUser = await getCurrentUserData();

    // If requesting current user's data, return it
    if (currentUser && currentUser.id === userId) {
      return { success: true, data: currentUser };
    }

    // For other users, fetch their actual data
    const userData = await fetchUserData(userId);
    if (userData) {
      return { success: true, data: userData };
    }

    // Fallback to basic user object if fetch fails
    const user: User = {
      id: userId,
      email: "",
      created_at: new Date().toISOString(),
    };

    return { success: true, data: user };
  } catch (error) {
    console.error("Error in getUserById:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kullanıcı bilgileri alınırken hata oluştu",
    };
  }
}

// Get user data by ID
export async function getUserData(userId: string): Promise<{
  success: boolean;
  data?: User;
  error?: string;
}> {
  try {
    const userData = await fetchUserData(userId);

    if (!userData) {
      return { success: false, error: "Kullanıcı bulunamadı" };
    }

    return { success: true, data: userData };
  } catch (error) {
    console.error("Error in getUserData:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kullanıcı verileri alınırken hata oluştu",
    };
  }
}
