-- ============================================================================
-- 03_rls.sql — Row Level Security policies
-- Public: read-only on most tables.
-- Authenticated admins: full CRUD on the data tables.
-- Storage: see 04_storage.sql for bucket policies.
-- ============================================================================

-- Enable RLS on every table
ALTER TABLE categories          ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE images              ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE opening_hours       ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections   ENABLE ROW LEVEL SECURITY;

-- Helper: is the current request from an authenticated user?
-- (Supabase auth.uid() returns the UUID of the logged-in user.)
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ----- CATEGORIES ---------------------------------------------------------
DROP POLICY IF EXISTS "categories_public_read"  ON categories;
DROP POLICY IF EXISTS "categories_admin_write"  ON categories;

CREATE POLICY "categories_public_read"
  ON categories FOR SELECT
  USING (TRUE);

CREATE POLICY "categories_admin_write"
  ON categories FOR ALL
  USING     (is_admin())
  WITH CHECK (is_admin());

-- ----- DISHES -------------------------------------------------------------
DROP POLICY IF EXISTS "dishes_public_read"  ON dishes;
DROP POLICY IF EXISTS "dishes_admin_write"  ON dishes;

CREATE POLICY "dishes_public_read"
  ON dishes FOR SELECT
  USING (TRUE);

CREATE POLICY "dishes_admin_write"
  ON dishes FOR ALL
  USING     (is_admin())
  WITH CHECK (is_admin());

-- ----- IMAGES (metadata) --------------------------------------------------
DROP POLICY IF EXISTS "images_public_read"  ON images;
DROP POLICY IF EXISTS "images_admin_write"  ON images;

CREATE POLICY "images_public_read"
  ON images FOR SELECT
  USING (TRUE);

CREATE POLICY "images_admin_write"
  ON images FOR ALL
  USING     (is_admin())
  WITH CHECK (is_admin());

-- ----- RESTAURANT SETTINGS ------------------------------------------------
DROP POLICY IF EXISTS "settings_public_read" ON restaurant_settings;
DROP POLICY IF EXISTS "settings_admin_write" ON restaurant_settings;

CREATE POLICY "settings_public_read"
  ON restaurant_settings FOR SELECT
  USING (TRUE);

CREATE POLICY "settings_admin_write"
  ON restaurant_settings FOR ALL
  USING     (is_admin())
  WITH CHECK (is_admin());

-- ----- OPENING HOURS ------------------------------------------------------
DROP POLICY IF EXISTS "hours_public_read" ON opening_hours;
DROP POLICY IF EXISTS "hours_admin_write" ON opening_hours;

CREATE POLICY "hours_public_read"
  ON opening_hours FOR SELECT
  USING (TRUE);

CREATE POLICY "hours_admin_write"
  ON opening_hours FOR ALL
  USING     (is_admin())
  WITH CHECK (is_admin());

-- ----- HOMEPAGE SECTIONS --------------------------------------------------
DROP POLICY IF EXISTS "homepage_public_read" ON homepage_sections;
DROP POLICY IF EXISTS "homepage_admin_write" ON homepage_sections;

CREATE POLICY "homepage_public_read"
  ON homepage_sections FOR SELECT
  USING (TRUE);

CREATE POLICY "homepage_admin_write"
  ON homepage_sections FOR ALL
  USING     (is_admin())
  WITH CHECK (is_admin());
