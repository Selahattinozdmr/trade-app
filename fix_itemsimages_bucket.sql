-- Quick fix for itemsimages bucket RLS policy violation
-- Run this in your Supabase SQL Editor

-- First, check if the bucket exists
SELECT name, public FROM storage.buckets WHERE name = 'itemsimages';

-- If the bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
VALUES ('itemsimages', 'itemsimages', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Remove any existing conflicting policies
DELETE FROM storage.policies WHERE bucket_id = 'itemsimages';

-- Create a simple, permissive policy for testing
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Allow authenticated users full access to itemsimages',
  'itemsimages',
  'SELECT',
  'auth.role() = ''authenticated'''
),
(
  'Allow authenticated users to upload to itemsimages', 
  'itemsimages',
  'INSERT',
  'auth.role() = ''authenticated'''
),
(
  'Allow authenticated users to update itemsimages',
  'itemsimages', 
  'UPDATE',
  'auth.role() = ''authenticated'''
),
(
  'Allow authenticated users to delete from itemsimages',
  'itemsimages',
  'DELETE', 
  'auth.role() = ''authenticated'''
);

-- Verify the policies were created
SELECT name, bucket_id, operation, definition 
FROM storage.policies 
WHERE bucket_id = 'itemsimages';
