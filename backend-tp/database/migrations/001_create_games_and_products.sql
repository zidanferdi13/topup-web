-- Games: daftar game yang menyediakan produk top-up
CREATE TABLE IF NOT EXISTS games (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  publisher VARCHAR(150) DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  icon_url VARCHAR(255) DEFAULT NULL,
  banner_url VARCHAR(255) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_games_slug (slug),
  KEY idx_games_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products: item top-up (denominasi) milik sebuah game
CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  game_id CHAR(36) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  original_price DECIMAL(12,2) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_products_sku (sku),
  KEY idx_products_game (game_id, is_active, sort_order),
  CONSTRAINT fk_products_game FOREIGN KEY (game_id) REFERENCES games (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
