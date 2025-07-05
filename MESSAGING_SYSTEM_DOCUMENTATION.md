# Messaging System Documentation

## Overview

The messaging system allows users to communicate with each other through real-time conversations. It includes conversation management, message sending/receiving, and real-time updates using Supabase real-time features.

## Database Schema

### Tables Created

#### 1. conversations

Stores conversation between two users.

```sql
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user1_id uuid references auth.users(id) on delete cascade,
  user2_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user1_id, user2_id)
);
```

#### 2. messages

Stores individual messages within conversations.

```sql
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  read_at timestamp with time zone
);
```

### Database Functions

#### get_or_create_conversation

Creates a conversation between two users if it doesn't exist, or returns the existing one.

```sql
CREATE OR REPLACE FUNCTION get_or_create_conversation(current_user_id uuid, other_user_id uuid)
RETURNS uuid
```

### Row Level Security (RLS)

- Users can only view conversations they are part of
- Users can only send messages to conversations they are part of
- Users can only mark their own messages as read

### Triggers

- `update_conversation_on_message`: Updates conversation timestamp when new message is sent

## File Structure

```
src/features/messages/
├── actions.ts                                 # Server actions for message operations
├── index.ts                                   # Feature exports
└── components/
    ├── index.ts                              # Component exports
    ├── ConversationList.tsx                  # List of user conversations
    ├── MessageThread.tsx                     # Message display and input
    ├── MessageThreadClientWrapper.tsx        # Real-time wrapper
    └── ContactOwnerButton.tsx               # Button to start conversations

src/app/(authenticated)/messages/
├── page.tsx                                  # Messages main page
└── [userId]/
    └── page.tsx                             # Dynamic user conversation page
```

## TypeScript Types

### Message Types

```typescript
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at?: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  user1?: User;
  user2?: User;
  latest_message?: Message;
  unread_count?: number;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export interface SendMessageData {
  content: string;
  conversation_id: string;
}
```

## Server Actions

### getUserConversations(userId: string)

Retrieves all conversations for a user with:

- Partner user information
- Latest message
- Unread message count

### getConversationMessages(conversationId: string)

Retrieves all messages for a specific conversation ordered by creation time.

### sendMessage(messageData: SendMessageData)

Sends a new message to a conversation and updates the conversation timestamp.

### getOrCreateConversation(otherUserId: string)

Gets an existing conversation with another user or creates a new one.

### markMessagesAsRead(conversationId: string)

Marks unread messages as read for the current user in a conversation.

### getUserById(userId: string)

Retrieves user information by ID (used for conversation partner details).

## Components

### ConversationList

Displays a list of user conversations with:

- Partner avatar and name
- Latest message preview
- Unread message indicators
- Time of last message
- Active conversation highlighting

**Props:**

- `conversations: Conversation[]` - List of conversations
- `currentUserId: string` - Current user ID
- `selectedUserId?: string` - Currently selected user ID

### MessageThread

Main messaging interface with:

- Message history display
- Message input form
- Real-time message sending
- Automatic scroll to bottom
- Message timestamps
- Read status indicators

**Props:**

- `messages: Message[]` - List of messages
- `currentUserId: string` - Current user ID
- `conversationId: string` - Conversation ID
- `partner: User` - Conversation partner info
- `onMessageSent?: () => void` - Callback after message sent

### MessageThreadClientWrapper

Client-side wrapper that adds real-time functionality:

- Subscribes to new messages via Supabase real-time
- Updates message list in real-time
- Handles automatic re-rendering

**Props:**

- `initialMessages: Message[]` - Initial messages from server
- `currentUserId: string` - Current user ID
- `conversationId: string` - Conversation ID
- `partner: User` - Conversation partner info

### ContactOwnerButton

Button component for starting conversations from item pages:

- Redirects to messages page with specific user
- Disabled for own items
- Loading states
- Responsive design

**Props:**

- `ownerId: string` - Item owner's user ID
- `currentUserId: string` - Current user ID
- `ownerName?: string` - Optional owner display name

## Pages

### /messages

Main messages page showing:

- Left sidebar with conversation list
- Empty state when no conversation selected
- Responsive design for mobile/desktop

### /messages/[userId]

Dynamic conversation page showing:

- Left sidebar with conversation list (with selected state)
- Right side with active conversation
- Real-time message updates
- Automatic conversation creation if needed

## Real-time Features

The messaging system uses Supabase real-time subscriptions to:

- Instantly show new messages
- Update conversation list order
- Show typing indicators (future enhancement)
- Update read status (future enhancement)

### Real-time Implementation

```typescript
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
      setMessages((prev) => [...prev, newMessage]);
    }
  )
  .subscribe();
```

## Security Features

### Authentication

- All message operations require authentication
- Users can only access their own conversations
- Message sending is restricted to conversation participants

### Authorization

- RLS policies prevent unauthorized access
- Users cannot read messages from conversations they're not part of
- Database functions ensure proper conversation creation

### Data Validation

- Message content is required and validated
- Conversation IDs are validated before operations
- User IDs are checked against authenticated user

## Usage Examples

### Starting a Conversation from Item Page

```tsx
import { ContactOwnerButton } from "@/features/messages";

<ContactOwnerButton
  ownerId={item.user_id}
  currentUserId={currentUser.id}
  ownerName={ownerDisplayName}
/>;
```

### Displaying User Conversations

```tsx
import { ConversationList } from "@/features/messages";

<ConversationList
  conversations={conversations}
  currentUserId={user.id}
  selectedUserId={selectedUserId}
/>;
```

### Real-time Message Thread

```tsx
import { MessageThreadClientWrapper } from "@/features/messages";

<MessageThreadClientWrapper
  initialMessages={messages}
  currentUserId={user.id}
  conversationId={conversationId}
  partner={partner}
/>;
```

## Performance Considerations

### Database Optimization

- Indexes on conversation users and message timestamps
- Efficient queries with proper joins
- Limited message loading (can be paginated in future)

### Real-time Efficiency

- Targeted subscriptions per conversation
- Duplicate message prevention
- Automatic cleanup of subscriptions

### UI Performance

- Optimistic UI updates
- Loading states for all operations
- Efficient re-rendering with React keys

## Future Enhancements

### Planned Features

1. **Message Pagination**: Load older messages on scroll
2. **Typing Indicators**: Show when someone is typing
3. **Message Status**: Delivered/Read indicators
4. **File Attachments**: Send images and files
5. **Message Search**: Search within conversations
6. **Push Notifications**: Real-time notifications
7. **Conversation Archiving**: Archive old conversations
8. **Block/Report**: User safety features

### Technical Improvements

1. **Caching**: Implement conversation and message caching
2. **Offline Support**: Queue messages when offline
3. **Message Encryption**: End-to-end encryption
4. **Performance**: Virtual scrolling for large conversations
5. **Accessibility**: Better screen reader support
6. **Internationalization**: Multi-language support

## Troubleshooting

### Common Issues

#### Messages Not Appearing

1. Check real-time subscription status
2. Verify conversation ID is correct
3. Check RLS policies
4. Ensure user is authenticated

#### Real-time Not Working

1. Verify Supabase real-time is enabled
2. Check subscription channel names
3. Ensure proper cleanup of subscriptions
4. Check browser console for errors

#### Permission Errors

1. Verify RLS policies are set correctly
2. Check user authentication status
3. Ensure conversation participants are correct
4. Verify database function permissions

### Error Handling

All server actions return structured responses:

```typescript
{
  success: boolean;
  data?: T;
  error?: string;
}
```

Error messages are user-friendly and localized in Turkish.

## Installation & Setup

### 1. Run Database Setup

```sql
-- Execute the SQL in MESSAGES_DATABASE_SETUP.sql
-- This creates tables, RLS policies, functions, and triggers
```

### 2. Environment Variables

Ensure these are set in your `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Real-time Configuration

Enable real-time in your Supabase project settings:

- Go to Settings > API
- Enable Real-time for the `messages` table

### 4. Test the Implementation

1. Create two user accounts
2. Visit an item detail page
3. Click "Contact Owner" button
4. Send messages and verify real-time updates
5. Check conversation list updates

## API Reference

### Server Actions Return Types

All server actions follow this pattern:

```typescript
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

### Error Codes

- Authentication errors: "Kimlik doğrulama gerekli"
- Permission errors: "Bu işlem için yetkiniz yok"
- Validation errors: "Geçersiz veri"
- Database errors: Specific error messages in Turkish
