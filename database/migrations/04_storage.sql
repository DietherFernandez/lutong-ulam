-- ============================================================================
-- 04_storage.sql — Supabase Storage buckets and policies
-- Run in Supabase SQL Editor AFTER creating the project.
-- Storage bucket creation is NOT done via SQL in production —
-- do it in the Supabase Dashboard: Storage → New Bucket.
-- This file documents the required bucket config and RLS policies.
-- ============================================================================

-- 1. Create two public buckets in the Supabase Dashboard:
--    Bucket Name: "images"   (Public: YES)
--    Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
--    Max file size: 5 MB
--
--    Bucket Name: "homepage" (Public: YES)
--    Allowed MIME types: image/jpeg, image/png, image/webp
--    Max file size: 5 MB

-- 2. Storage RLS policies (run in SQL Editor for each bucket):

-- Images bucket: anyone can view, only authenticated users can upload/delete
DROP POLICY IF EXISTS "images_storage_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "images_storage_admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "images_storage_admin_delete" ON storage.objects;

CREATE POLICY "images_storage_public_read"
  ON storage.objects FOR SELECT
  USING     (bucket_id = 'images');

CREATE POLICY "images_storage_admin_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.uid() IS NOT NULL);

CREATE POLICY "images_storage_admin_delete"
  ON storage.objects FOR DELETE
  USING     (bucket_id = 'images' AND auth.uid() IS NOT NULL);

-- Homepage bucket: same pattern
DROP POLICY IF EXISTS "homepage_storage_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "homepage_storage_admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "homepage_storage_admin_delete" ON storage.objects;

CREATE POLICY "homepage_storage_public_read"
  ON storage.objects FOR SELECT
  USING     (bucket_id = 'homepage');

CREATE POLICY "homepage_storage_admin_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'homepage' AND auth.uid() IS NOT NULL);

CREATE POLICY "homepage_storage_admin_delete"
  ON storage.objects FOR DELETE
  USING     (bucket_id = 'homepage' AND auth.uid() IS NOT NULL);
