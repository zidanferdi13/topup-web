-- Sample data game & produk top-up. Aman dijalankan ulang (idempotent).
INSERT INTO games (slug, name, publisher, category, icon_url, banner_url, is_active, sort_order) VALUES
  ('mobile-legends', 'Mobile Legends: Bang Bang', 'Moonton', 'MOBA', NULL, NULL, 1, 1),
  ('free-fire', 'Free Fire', 'Garena', 'Battle Royale', NULL, NULL, 1, 2),
  ('pubg-mobile', 'PUBG Mobile', 'Tencent Games', 'Battle Royale', NULL, NULL, 1, 3),
  ('genshin-impact', 'Genshin Impact', 'HoYoverse', 'Open World', NULL, NULL, 1, 4)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  publisher = VALUES(publisher),
  category = VALUES(category),
  is_active = VALUES(is_active),
  sort_order = VALUES(sort_order);

INSERT INTO products (game_id, sku, name, description, price, original_price, is_active, sort_order) VALUES
  ((SELECT id FROM games WHERE slug = 'mobile-legends'), 'MLBB-86', '86 Diamonds', '86 Diamonds Mobile Legends', 20000.00, 22000.00, 1, 1),
  ((SELECT id FROM games WHERE slug = 'mobile-legends'), 'MLBB-172', '172 Diamonds', '172 Diamonds Mobile Legends', 39000.00, 42000.00, 1, 2),
  ((SELECT id FROM games WHERE slug = 'mobile-legends'), 'MLBB-257', '257 Diamonds', '257 Diamonds Mobile Legends', 58000.00, 62000.00, 1, 3),
  ((SELECT id FROM games WHERE slug = 'free-fire'), 'FF-70', '70 Diamonds', '70 Diamonds Free Fire', 10000.00, NULL, 1, 1),
  ((SELECT id FROM games WHERE slug = 'free-fire'), 'FF-140', '140 Diamonds', '140 Diamonds Free Fire', 20000.00, 22000.00, 1, 2),
  ((SELECT id FROM games WHERE slug = 'pubg-mobile'), 'PUBG-60UC', '60 UC', '60 Unknown Cash PUBG Mobile', 15000.00, NULL, 1, 1),
  ((SELECT id FROM games WHERE slug = 'pubg-mobile'), 'PUBG-325UC', '325 UC', '325 Unknown Cash PUBG Mobile', 75000.00, 80000.00, 1, 2),
  ((SELECT id FROM games WHERE slug = 'genshin-impact'), 'GI-60', '60 Genesis Crystals', '60 Genesis Crystals Genshin Impact', 16000.00, NULL, 1, 1),
  ((SELECT id FROM games WHERE slug = 'genshin-impact'), 'GI-300', '300 + 30 Genesis Crystals', '300 Genesis Crystals bonus 30', 79000.00, 85000.00, 1, 2)
ON DUPLICATE KEY UPDATE
  game_id = VALUES(game_id),
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  original_price = VALUES(original_price),
  is_active = VALUES(is_active),
  sort_order = VALUES(sort_order);
