# Supabase Storage Setup Guide

## Creating Storage Buckets

To enable file uploads, you need to create storage buckets in your Supabase project:

### 1. Create the Avatars Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create bucket**
4. Set the bucket name to: `avatars`
5. Make it **Public** (for profile images)
6. Click **Create bucket**

### 2. Create the Items Images Bucket

1. In the same **Storage** section
2. Click **Create bucket** again
3. Set the bucket name to: `itemsimages`
4. Make it **Public** (for item images)
5. Click **Create bucket**

### 3. Set up Storage Policies

After creating the buckets, you need to set up Row Level Security (RLS) policies:

```sql
-- Avatars bucket policies
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

-- Items images bucket policies
-- Allow authenticated users to upload item images
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users can upload item images',
  'itemsimages',
  'INSERT',
  'auth.uid()::text = (storage.foldername(name))[1]'
);

-- Allow public read access to item images
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Public can view item images',
  'itemsimages',
  'SELECT',
  'true'
);

-- Allow users to update their own item images
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users can update their own item images',
  'itemsimages',
  'UPDATE',
  'auth.uid()::text = (storage.foldername(name))[1]'
);

-- Allow users to delete their own item images
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users can delete their own item images',
  'itemsimages',
  'DELETE',
  'auth.uid()::text = (storage.foldername(name))[1]'
);
```

## Alternative RLS Policies (if the above don't work)

If you're getting RLS policy violations, try these simpler policies:

```sql
-- For itemsimages bucket - Simple approach
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload item images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'itemsimages'
);

-- Allow authenticated users to view
CREATE POLICY "Authenticated users can view item images" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'itemsimages'
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own item images" ON storage.objects
FOR UPDATE TO authenticated USING (
  bucket_id = 'itemsimages' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own item images" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'itemsimages' AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## Even Simpler Policies (for testing)

If you're still having issues, use these very permissive policies for testing:

```sql
-- Very permissive policies for itemsimages bucket (for testing only)
CREATE POLICY "Allow all for itemsimages" ON storage.objects
FOR ALL TO authenticated USING (bucket_id = 'itemsimages')
WITH CHECK (bucket_id = 'itemsimages');
```

````

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
````

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

### RLS Policy Violation Error

If you get "new row violates row-level security policy" error:

1. **Check if the bucket exists:**

   ```sql
   SELECT * FROM storage.buckets WHERE name = 'itemsimages';
   ```

2. **Check if RLS is enabled on storage.objects:**

   ```sql
   SELECT schemaname, tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'storage' AND tablename = 'objects';
   ```

3. **Check existing policies:**

   ```sql
   SELECT * FROM storage.policies WHERE bucket_id = 'itemsimages';
   ```

4. **Remove all existing policies and add the simple one:**

   ```sql
   -- Delete existing policies
   DELETE FROM storage.policies WHERE bucket_id = 'itemsimages';

   -- Add simple policy
   CREATE POLICY "Allow all for itemsimages" ON storage.objects
   FOR ALL TO authenticated USING (bucket_id = 'itemsimages')
   WITH CHECK (bucket_id = 'itemsimages');
   ```

5. **Alternative: Use the Supabase Dashboard:**
   - Go to Storage > itemsimages bucket
   - Click on "Policies" tab
   - Add a new policy with these settings:
     - Policy name: "Allow authenticated uploads"
     - Allowed operation: INSERT
     - Target roles: authenticated
     - USING expression: `bucket_id = 'itemsimages'`
     - WITH CHECK expression: `bucket_id = 'itemsimages'`

### Other Common Issues

- **Bucket not found**: Create the bucket as described above
- **Permission denied**: Check RLS policies are set correctly
- **File too large**: Ensure file is under 5MB
- **Invalid file type**: Only image files are allowed
