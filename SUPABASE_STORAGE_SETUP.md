# Supabase Storage Setup Guide

## Creating the Avatars Bucket

To enable avatar uploads, you need to create a storage bucket in your Supabase project:

### 1. Create the Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create bucket**
4. Set the bucket name to: `avatars`
5. Make it **Public** (for profile images)
6. Click **Create bucket**

### 2. Set up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

```sql
-- Allow authenticated users to upload their own avatars
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users can upload their own avatar',
  'avatars',
  'INSERT',
  'auth.uid()::text = (storage.foldername(name))[1]'
);

-- Allow public read access to avatars
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Public can view avatars',
  'avatars',
  'SELECT',
  'true'
);

-- Allow users to update their own avatars
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users can update their own avatar',
  'avatars',
  'UPDATE',
  'auth.uid()::text = (storage.foldername(name))[1]'
);

-- Allow users to delete their own avatars
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users can delete their own avatar',
  'avatars',
  'DELETE',
  'auth.uid()::text = (storage.foldername(name))[1]'
);
```

### 3. Alternative: Programmatic Bucket Creation

If you want to create the bucket programmatically, you can use this function:

```typescript
import { createClient } from '@supabase/supabase-js';

export async function setupAvatarBucket() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key needed for admin operations
  );

  try {
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('avatars', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error) {
      console.error('Error creating bucket:', error);
      return false;
    }

    console.log('Avatars bucket created successfully');
    return true;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
```

### 4. File Structure

The avatar files will be stored with this naming pattern:
```
avatars/
  ├── {userId}-{timestamp}.{extension}
  ├── 869b56d4-83bb-41e6-9c63-b6aada32b8b9-1751553842724.jpg
  └── ...
```

### 5. Testing

After setup, test the avatar upload functionality:
1. Go to your profile page
2. Click on the avatar area
3. Select an image file
4. Verify the upload completes successfully
5. Check that the image displays correctly

## Troubleshooting

- **Bucket not found**: Create the bucket as described above
- **Permission denied**: Check RLS policies are set correctly
- **File too large**: Ensure file is under 5MB
- **Invalid file type**: Only PNG, JPEG, and WebP are allowed
