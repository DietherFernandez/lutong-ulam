-- ============================================================================
-- 02_seed.sql — Default data. Inserts only when tables are empty.
-- Run AFTER 01_schema.sql in the Supabase SQL Editor.
-- ============================================================================

-- Categories
INSERT INTO categories (name, description, sort_order)
SELECT * FROM (VALUES
  ('Appetizers',  'Start your meal with our delicious appetizers', 1),
  ('Main Course', 'Hearty main dishes',                              2),
  ('Rice Meals',  'Delicious rice-based meals',                      3),
  ('Noodles',     'Fresh noodle dishes',                             4),
  ('Seafood',     'Fresh from the ocean',                            5),
  ('Drinks',      'Refreshing beverages',                            6),
  ('Desserts',    'Sweet endings',                                   7)
) AS v(name, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM categories);

-- Opening hours
INSERT INTO opening_hours (day, opening_time, closing_time, is_closed)
SELECT * FROM (VALUES
  ('monday',    '11:00', '22:00', FALSE),
  ('tuesday',   '11:00', '22:00', FALSE),
  ('wednesday', '11:00', '22:00', FALSE),
  ('thursday',  '11:00', '22:00', FALSE),
  ('friday',    '11:00', '23:00', FALSE),
  ('saturday',  '10:00', '23:00', FALSE),
  ('sunday',    '10:00', '21:00', FALSE)
) AS v(day, opening_time, closing_time, is_closed)
WHERE NOT EXISTS (SELECT 1 FROM opening_hours);

-- Homepage sections
INSERT INTO homepage_sections (section_key, title, subtitle, image, is_enabled)
SELECT * FROM (VALUES
  ('hero',     'Welcome to La Maison Doree', 'Experience the finest dining with fresh ingredients and exceptional service', '', TRUE),
  ('about',    'Our Story',                  'We have been serving delicious food since 2010',                       '', TRUE),
  ('featured', 'Featured Dishes',            'Our chef''s special recommendations',                                 '', TRUE)
) AS v(section_key, title, subtitle, image, is_enabled)
WHERE NOT EXISTS (SELECT 1 FROM homepage_sections);

-- Restaurant settings
INSERT INTO restaurant_settings (setting_key, setting_value)
SELECT * FROM (VALUES
  ('restaurant_name', 'La Maison Doree'),
  ('tagline',         'Where Flavor Meets Passion'),
  ('description',     'Experience the finest dining with fresh ingredients and exceptional service.'),
  ('phone',           '+1 (212) 555-0142'),
  ('email',           'hello@maisondoree.com'),
  ('address',         '123 Culinary Avenue, Manhattan, NY 10001'),
  ('latitude',        '40.7128'),
  ('longitude',       '-74.0060'),
  ('google_maps_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2200000000003!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a2f8c2e8f9b%3A0x123456789abcdef!2s123%20Culinary%20St%2C%20Food%20City%2C%20FC%2012345!5e0!3m2!1sen!2sus!4v1234567890'),
  ('facebook_url',    'https://facebook.com/'),
  ('instagram_url',   'https://instagram.com/')
) AS v(setting_key, setting_value)
WHERE NOT EXISTS (SELECT 1 FROM restaurant_settings);
