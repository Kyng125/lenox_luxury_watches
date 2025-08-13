-- Insert sample brands
INSERT INTO brands (name, description) VALUES
('Rolex', 'Swiss luxury watch manufacturer known for precision and prestige'),
('Omega', 'Swiss luxury watchmaker with a rich heritage in precision timekeeping'),
('Patek Philippe', 'Swiss luxury watch manufacturer renowned for complicated timepieces'),
('Audemars Piguet', 'Swiss manufacturer of luxury mechanical watches and clocks'),
('Breitling', 'Swiss luxury watchmaker specializing in chronometers for aviation');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Dress Watches', 'Elegant timepieces perfect for formal occasions'),
('Sport Watches', 'Robust watches designed for active lifestyles'),
('Diving Watches', 'Water-resistant watches built for underwater exploration'),
('Chronographs', 'Precision timepieces with stopwatch functionality'),
('GMT Watches', 'Multi-timezone watches for world travelers');

-- Insert sample products
INSERT INTO products (name, description, price, brand_id, category_id, sku, stock_quantity, is_featured, specifications) 
SELECT 
  'Submariner Date',
  'The Rolex Submariner Date is a legendary diving watch, waterproof to 300 metres and equipped with a unidirectional rotating bezel.',
  12500.00,
  b.id,
  c.id,
  'ROL-SUB-001',
  5,
  true,
  '{"movement": "Automatic", "case_material": "Stainless Steel", "case_diameter": "41mm", "water_resistance": "300m", "crystal": "Sapphire"}'::jsonb
FROM brands b, categories c 
WHERE b.name = 'Rolex' AND c.name = 'Diving Watches';

INSERT INTO products (name, description, price, brand_id, category_id, sku, stock_quantity, is_featured, specifications)
SELECT 
  'Speedmaster Professional',
  'The legendary Omega Speedmaster Professional - the first watch worn on the moon.',
  6500.00,
  b.id,
  c.id,
  'OME-SPE-001',
  8,
  true,
  '{"movement": "Manual", "case_material": "Stainless Steel", "case_diameter": "42mm", "water_resistance": "50m", "crystal": "Hesalite"}'::jsonb
FROM brands b, categories c 
WHERE b.name = 'Omega' AND c.name = 'Chronographs';

INSERT INTO products (name, description, price, brand_id, category_id, sku, stock_quantity, is_featured, specifications)
SELECT 
  'Calatrava',
  'The epitome of the round watch and embodies the pure tradition of Patek Philippe.',
  35000.00,
  b.id,
  c.id,
  'PAT-CAL-001',
  3,
  true,
  '{"movement": "Manual", "case_material": "Rose Gold", "case_diameter": "39mm", "water_resistance": "30m", "crystal": "Sapphire"}'::jsonb
FROM brands b, categories c 
WHERE b.name = 'Patek Philippe' AND c.name = 'Dress Watches';

INSERT INTO products (name, description, price, brand_id, category_id, sku, stock_quantity, specifications)
SELECT 
  'Royal Oak',
  'The iconic Audemars Piguet Royal Oak with its distinctive octagonal bezel.',
  28000.00,
  b.id,
  c.id,
  'AUD-ROY-001',
  4,
  '{"movement": "Automatic", "case_material": "Stainless Steel", "case_diameter": "41mm", "water_resistance": "50m", "crystal": "Sapphire"}'::jsonb
FROM brands b, categories c 
WHERE b.name = 'Audemars Piguet' AND c.name = 'Sport Watches';

INSERT INTO products (name, description, price, brand_id, category_id, sku, stock_quantity, specifications)
SELECT 
  'Navitimer',
  'The Breitling Navitimer - the ultimate pilots chronograph with slide rule bezel.',
  8500.00,
  b.id,
  c.id,
  'BRE-NAV-001',
  6,
  '{"movement": "Automatic", "case_material": "Stainless Steel", "case_diameter": "46mm", "water_resistance": "30m", "crystal": "Sapphire"}'::jsonb
FROM brands b, categories c 
WHERE b.name = 'Breitling' AND c.name = 'Chronographs';

-- Insert sample product images
INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
SELECT p.id, '/rolex-submariner-main.png', 'Rolex Submariner Date main view', true, 1
FROM products p WHERE p.sku = 'ROL-SUB-001';

INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
SELECT p.id, '/omega-speedmaster-main.png', 'Omega Speedmaster Professional main view', true, 1
FROM products p WHERE p.sku = 'OME-SPE-001';

INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
SELECT p.id, '/patek-calatrava-main.png', 'Patek Philippe Calatrava main view', true, 1
FROM products p WHERE p.sku = 'PAT-CAL-001';

INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
SELECT p.id, '/ap-royal-oak-main.png', 'Audemars Piguet Royal Oak main view', true, 1
FROM products p WHERE p.sku = 'AUD-ROY-001';

INSERT INTO product_images (product_id, url, alt_text, is_primary, sort_order)
SELECT p.id, '/breitling-navitimer-main.png', 'Breitling Navitimer main view', true, 1
FROM products p WHERE p.sku = 'BRE-NAV-001';
