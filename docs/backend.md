# Backend (`backend-tp`)

REST API untuk website game top-up. Modular monolith: Node.js 18+, Express 4, MySQL (`mysql2/promise`, tanpa ORM), CommonJS.

## Menjalankan

Jalankan dari root workspace melalui PowerShell:

```powershell
Set-Location backend-tp
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Sesuaikan `.env` dengan koneksi MySQL sebelum melanjutkan.

```powershell
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS topup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cmd /c "mysql -u root -p topup < database\migrations\001_create_games_and_products.sql"
cmd /c "mysql -u root -p topup < database\seeders\001_games_and_products.sql"
npm run dev   # nodemon
```

Untuk production, gunakan `npm start` sebagai pengganti `npm run dev`.

Server tidak listen bila koneksi database gagal saat start.

## Environment

| Variable | Default | Keterangan |
| --- | --- | --- |
| `NODE_ENV` | `development` | `production` menyembunyikan pesan error 5xx dan stack trace |
| `PORT` | `3000` | Port HTTP |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` | - | Wajib, server berhenti bila kosong |
| `DB_PASSWORD` | kosong | Password MySQL |
| `DB_CONNECTION_LIMIT` | `10` | Ukuran pool |
| `CORS_ORIGIN` | `*` di kode, `http://localhost:3000` di `.env.example` | Origin yang diizinkan |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Window rate limit |
| `RATE_LIMIT_MAX` | `100` | Maks request per IP per window untuk `/api` |

## Struktur & Alur

```
Route -> Controller -> Service -> Repository -> MySQL
Service -> Provider -> External API (belum ada)
```

| File | Tugas |
| --- | --- |
| `src/server.js` | Cek DB, start server, graceful shutdown `SIGINT`/`SIGTERM` |
| `src/app.js` | Middleware `helmet`, `cors`, JSON body 1mb, `morgan`, rate limit, router, error handler |
| `src/config/env.js` | Baca dan validasi `.env` |
| `src/config/database.js` | Pool MySQL + `testConnection()` |
| `src/routes/index.js` | Health check, mount `/products`, placeholder module |
| `src/routes/product.routes.js` | Route products |
| `src/controllers/product.controller.js` | Handler HTTP products |
| `src/services/product.service.js` | Validasi, paginasi, mapping response, error 400/404 |
| `src/repositories/product.repository.js` | Query SQL parameterized |
| `src/validators/product.validator.js` | Validasi query list dan SKU |
| `src/middlewares/error.middleware.js` | Handler 404 dan error global |
| `src/middlewares/rate-limit.middleware.js` | `express-rate-limit` |
| `src/utils/response.js` | Format response standar |
| `src/utils/logger.js` | Logger console berlevel |
| `src/providers/payment`, `src/providers/topup` | Kosong, untuk integrasi eksternal |
| `tests/` | Kosong |

## Database

- `games`: `id` UUID, `slug` unik, `name`, `publisher`, `category`, `icon_url`, `banner_url`, `is_active`, `sort_order`, timestamp.
- `products`: `id` UUID, `game_id` FK ke `games.id` (cascade), `sku` unik, `name`, `description`, `price`, `original_price`, `is_active`, `sort_order`, timestamp.

## Endpoint

| Method | Endpoint | Hasil |
| --- | --- | --- |
| GET | `/` | Info API |
| GET | `/api/health` | 200 bila API jalan |
| GET | `/api/health/database` | 200 sehat, 503 gagal |
| GET | `/api/products` | List produk + paginasi |
| GET | `/api/products/:sku` | Detail produk, 404 bila tidak ada |
| ANY | `/api/player`, `/api/orders`, `/api/payments`, `/api/topup`, `/api/webhooks` (dan sub-path) | 501 belum diimplementasi |
| ANY | route lain | 404 |

Query `GET /api/products`:

| Param | Default | Aturan |
| --- | --- | --- |
| `game` | - | Slug game |
| `game_id` | - | UUID valid |
| `search` | - | Cari `name` atau `sku` |
| `is_active` | `true` | `true/false/1/0/yes/no` |
| `page` | `1` | Integer >= 1 |
| `limit` | `10` | Integer 1-100 |
| `sort_by` | `sort_order` | `id`, `name`, `price`, `sort_order`, `created_at` |
| `sort_dir` | `asc` | `asc`, `desc` |

Response:

```json
{ "success": true, "message": "...", "data": { "items": [], "meta": { "page": 1, "limit": 10, "total": 0, "total_pages": 0, "has_next_page": false, "has_prev_page": false } } }
{ "success": false, "message": "..." }
```

Item produk berisi `id`, `game_id`, `game { slug, name }`, `sku`, `name`, `description`, `price`, `original_price`, `is_active`, `sort_order`, `created_at`, `updated_at`. Field `stack` muncul pada error saat bukan `production`.

## Belum Ada

Auth, player, orders, payment gateway, top-up provider, webhook idempotent, dan test otomatis.
