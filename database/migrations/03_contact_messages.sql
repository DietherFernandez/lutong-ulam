-- ============================================================================
-- 03_contact_messages.sql — Contact form messages system
-- Run AFTER 01_schema.sql and 02_seed.sql in the Supabase SQL Editor.
-- ============================================================================

-- Contact Messages table --------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_is_read    ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON contact_messages(created_at DESC);

-- Row Level Security (RLS) -----------------------------------------------
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (public) can INSERT a message
DROP POLICY IF EXISTS "Public can submit messages" ON contact_messages;
CREATE POLICY "Public can submit messages" ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can SELECT/UPDATE/DELETE messages
DROP POLICY IF EXISTS "Authenticated can view messages" ON contact_messages;
CREATE POLICY "Authenticated can view messages" ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can update messages" ON contact_messages;
CREATE POLICY "Authenticated can update messages" ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated can delete messages" ON contact_messages;
CREATE POLICY "Authenticated can delete messages" ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Auto-cleanup function (prevents storage from filling up) ----------------
-- Settings value:
--   '0'  = Never delete (manual cleanup required)
--   '30' = Keep 30 days
--   '60' = Keep 60 days
--   '90' = Keep 90 days (default)
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS TRIGGER AS $$
DECLARE
  retention_days INTEGER;
BEGIN
  -- Get retention setting (default 90 if not set)
  SELECT COALESCE(NULLIF(setting_value, '')::INTEGER, 90)
  INTO retention_days
  FROM restaurant_settings
  WHERE setting_key = 'message_retention_days';

  -- Only cleanup if retention > 0 (0 means "Never")
  IF retention_days > 0 THEN
    DELETE FROM contact_messages
    WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger fires after each INSERT (cleanup runs when new message arrives)
DROP TRIGGER IF EXISTS trg_cleanup_messages ON contact_messages;
CREATE TRIGGER trg_cleanup_messages
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_old_messages();

-- Default settings -------------------------------------------------------
-- message_retention_days: '0'=Never, '30', '60', '90' (default)
INSERT INTO restaurant_settings (setting_key, setting_value)
SELECT 'message_retention_days', '90'
WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'message_retention_days');
-- Website text defaults
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'featured_section_title', 'Featured Dishes' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'featured_section_title');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'featured_section_subtitle', 'Handcrafted dishes made with the finest, locally-sourced ingredients' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'featured_section_subtitle');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'menu_page_title', 'Discover Our Dishes' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'menu_page_title');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'menu_page_subtitle', 'From appetizers to desserts, every dish is crafted with passion using the freshest ingredients.' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'menu_page_subtitle');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'contact_page_title', 'Contact Us' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'contact_page_title');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'contact_page_subtitle', 'We''d love to hear from you. Reach out with questions, reservation requests, or just to say hello.' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'contact_page_subtitle');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'contact_form_title', 'Send us a Message' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'contact_form_title');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'about_story_title', 'A Passion for Great Food' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'about_story_title');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'about_chef_title', 'Our Head Chef' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'about_chef_title');
INSERT INTO restaurant_settings (setting_key, setting_value) SELECT 'about_values_title', 'Our Core Values' WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings WHERE setting_key = 'about_values_title');
