-- ============================================================================
-- 01_schema.sql — Restaurant Website Database Schema for Supabase/PostgreSQL
-- Run this FIRST in the Supabase SQL Editor (Database -> SQL Editor -> New query)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dishes -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dishes (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL,
  category_id   BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  image         TEXT,
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dishes_category   ON dishes(category_id);
CREATE INDEX IF NOT EXISTS idx_dishes_featured   ON dishes(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_dishes_available  ON dishes(is_available) WHERE is_available = TRUE;

-- Images (metadata only; the actual file lives in Supabase Storage) -------
CREATE TABLE IF NOT EXISTS images (
  id            BIGSERIAL PRIMARY KEY,
  filename      TEXT NOT NULL,
  original_name TEXT,
  file_path     TEXT NOT NULL,
  public_url    TEXT NOT NULL,
  file_size     BIGINT,
  mime_type     TEXT,
  alt_text      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Restaurant settings (key/value) -----------------------------------------
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id            BIGSERIAL PRIMARY KEY,
  setting_key   TEXT UNIQUE NOT NULL,
  setting_value TEXT
);

-- Opening hours ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opening_hours (
  id            BIGSERIAL PRIMARY KEY,
  day           TEXT UNIQUE NOT NULL,
  opening_time  TEXT,
  closing_time  TEXT,
  is_closed     BOOLEAN NOT NULL DEFAULT FALSE
);

-- Homepage sections --------------------------------------------------------
CREATE TABLE IF NOT EXISTS homepage_sections (
  id            BIGSERIAL PRIMARY KEY,
  section_key   TEXT UNIQUE NOT NULL,
  title         TEXT,
  subtitle      TEXT,
  image         TEXT,
  is_enabled    BOOLEAN NOT NULL DEFAULT TRUE
);

-- Auto-update updated_at on dishes ----------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_dishes_updated_at ON dishes;
CREATE TRIGGER trg_dishes_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
