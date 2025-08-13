-- Create categories
INSERT INTO categories (id, name, slug, description) VALUES
('cat_luxury_swiss', 'Luxury Swiss', 'luxury-swiss', 'Premium Swiss timepieces crafted with precision'),
('cat_vintage_classic', 'Vintage Classic', 'vintage-classic', 'Timeless vintage watches with classic appeal'),
('cat_modern_sport', 'Modern Sport', 'modern-sport', 'Contemporary sports watches for active lifestyles'),
('cat_dress_formal', 'Dress & Formal', 'dress-formal', 'Elegant dress watches for formal occasions');

-- Create brands
INSERT INTO brands (id, name, slug, logo) VALUES
('brand_rolex', 'Rolex', 'rolex', '/images/brands/rolex-logo.png'),
('brand_omega', 'Omega', 'omega', '/images/brands/omega-logo.png'),
('brand_patek', 'Patek Philippe', 'patek-philippe', '/images/brands/patek-logo.png'),
('brand_cartier', 'Cartier', 'cartier', '/images/brands/cartier-logo.png'),
('brand_breitling', 'Breitling', 'breitling', '/images/brands/breitling-logo.png');

-- Create sample products
INSERT INTO products (id, name, slug, description, price, sku, stock, "categoryId", "brandId", "isFeatured") VALUES
('prod_submariner', 'Submariner Date', 'rolex-submariner-date', 'The Rolex Submariner Date is a legendary diving watch, waterproof to 300 metres and equipped with a unidirectional rotating bezel.', 13150.00, 'ROL-SUB-001', 5, 'cat_luxury_swiss', 'brand_rolex', true),
('prod_speedmaster', 'Speedmaster Professional', 'omega-speedmaster-professional', 'The legendary Omega Speedmaster Professional - the first watch worn on the moon. Manual winding chronograph movement.', 6350.00, 'OME-SPE-001', 8, 'cat_vintage_classic', 'brand_omega', true),
('prod_nautilus', 'Nautilus 5711/1A', 'patek-philippe-nautilus', 'The iconic Patek Philippe Nautilus with its distinctive porthole design and integrated bracelet.', 34890.00, 'PAT-NAU-001', 2, 'cat_luxury_swiss', 'brand_patek', true),
('prod_santos', 'Santos de Cartier', 'cartier-santos', 'The Santos de Cartier watch, a pioneer among modern timepieces, with its distinctive square case.', 7150.00, 'CAR-SAN-001', 6, 'cat_dress_formal', 'brand_cartier', false),
('prod_navitimer', 'Navitimer B01', 'breitling-navitimer-b01', 'The Breitling Navitimer B01 with its iconic circular slide rule and chronograph functionality.', 8600.00, 'BRE-NAV-001', 4, 'cat_modern_sport', 'brand_breitling', false);

-- Create product images
INSERT INTO "product_images" (id, url, alt, "isPrimary", "productId") VALUES
-- Rolex Submariner
('img_sub_1', '/images/products/rolex-submariner-1.jpg', 'Rolex Submariner Date front view', true, 'prod_submariner'),
('img_sub_2', '/images/products/rolex-submariner-2.jpg', 'Rolex Submariner Date side view', false, 'prod_submariner'),
('img_sub_3', '/images/products/rolex-submariner-3.jpg', 'Rolex Submariner Date back view', false, 'prod_submariner'),

-- Omega Speedmaster
('img_spe_1', '/images/products/omega-speedmaster-1.jpg', 'Omega Speedmaster Professional front view', true, 'prod_speedmaster'),
('img_spe_2', '/images/products/omega-speedmaster-2.jpg', 'Omega Speedmaster Professional side view', false, 'prod_speedmaster'),

-- Patek Philippe Nautilus
('img_nau_1', '/images/products/patek-nautilus-1.jpg', 'Patek Philippe Nautilus front view', true, 'prod_nautilus'),
('img_nau_2', '/images/products/patek-nautilus-2.jpg', 'Patek Philippe Nautilus side view', false, 'prod_nautilus'),

-- Cartier Santos
('img_san_1', '/images/products/cartier-santos-1.jpg', 'Cartier Santos front view', true, 'prod_santos'),
('img_san_2', '/images/products/cartier-santos-2.jpg', 'Cartier Santos side view', false, 'prod_santos'),

-- Breitling Navitimer
('img_nav_1', '/images/products/breitling-navitimer-1.jpg', 'Breitling Navitimer front view', true, 'prod_navitimer'),
('img_nav_2', '/images/products/breitling-navitimer-2.jpg', 'Breitling Navitimer side view', false, 'prod_navitimer');

-- Create product specifications
INSERT INTO "product_specifications" (id, name, value, "productId") VALUES
-- Rolex Submariner specs
('spec_sub_1', 'Case Material', 'Oystersteel', 'prod_submariner'),
('spec_sub_2', 'Case Diameter', '41mm', 'prod_submariner'),
('spec_sub_3', 'Water Resistance', '300m (1,000ft)', 'prod_submariner'),
('spec_sub_4', 'Movement', 'Perpetual, mechanical, self-winding', 'prod_submariner'),
('spec_sub_5', 'Power Reserve', 'Approximately 70 hours', 'prod_submariner'),

-- Omega Speedmaster specs
('spec_spe_1', 'Case Material', 'Stainless Steel', 'prod_speedmaster'),
('spec_spe_2', 'Case Diameter', '42mm', 'prod_speedmaster'),
('spec_spe_3', 'Water Resistance', '50m (165ft)', 'prod_speedmaster'),
('spec_spe_4', 'Movement', 'Manual winding chronograph', 'prod_speedmaster'),
('spec_spe_5', 'Crystal', 'Hesalite', 'prod_speedmaster'),

-- Patek Philippe Nautilus specs
('spec_nau_1', 'Case Material', 'Stainless Steel', 'prod_nautilus'),
('spec_nau_2', 'Case Diameter', '40mm', 'prod_nautilus'),
('spec_nau_3', 'Water Resistance', '120m (394ft)', 'prod_nautilus'),
('spec_nau_4', 'Movement', 'Self-winding', 'prod_nautilus'),
('spec_nau_5', 'Power Reserve', 'Min. 35 - max. 45 hours', 'prod_nautilus'),

-- Cartier Santos specs
('spec_san_1', 'Case Material', 'Stainless Steel', 'prod_santos'),
('spec_san_2', 'Case Dimensions', '35.1mm x 40.4mm', 'prod_santos'),
('spec_san_3', 'Water Resistance', '100m (330ft)', 'prod_santos'),
('spec_san_4', 'Movement', 'Automatic', 'prod_santos'),
('spec_san_5', 'Crystal', 'Sapphire', 'prod_santos'),

-- Breitling Navitimer specs
('spec_nav_1', 'Case Material', 'Stainless Steel', 'prod_navitimer'),
('spec_nav_2', 'Case Diameter', '43mm', 'prod_navitimer'),
('spec_nav_3', 'Water Resistance', '30m (100ft)', 'prod_navitimer'),
('spec_nav_4', 'Movement', 'Breitling Manufacture Caliber 01', 'prod_navitimer'),
('spec_nav_5', 'Power Reserve', 'Approximately 70 hours', 'prod_navitimer');
