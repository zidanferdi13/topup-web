# topup-backend

Backend API untuk website **game top-up**. Struktur modular monolith — modul **products** (list & detail produk top-up per game) sudah terimplementasi. Business logic lain (payment, top-up provider, authentication, integrasi API eksternal) belum dibuat.

## Tech Stack

- Node.js 18+
- Express.js 4
- MySQL (mysql2/promise, tanpa ORM)
- JavaScript CommonJS
- dotenv, cors, helmet, morgan, express-rate-limit
- nodemon (dev)

## Folder Structure

```
topup-backend/
├── src/
│   ├── app.js                 # Express app: middleware + routes
│   ├── server.js              # Entry point: DB check, listen, graceful shutdown
│   ├── config/
│   │   ├── env.js             # Baca & validasi environment variables
│   │   └── database.js        # MySQL connection pool + testConnection()
│   ├── routes/
│   │   ├── index.js           # Root router (/api) + mount modul
│   │   └── product.routes.js  # Route modul products
│   ├── controllers/
│   │   └── product.controller.js   # HTTP handler products
│   ├── services/
│   │   └── product.service.js      # Business logic products
│   ├── repositories/
│   │   └── product.repository.js   # Akses data / SQL products
│   ├── providers/
│   │   ├── payment/           # Integrasi payment gateway (belum diisi)
│   │   └── topup/             # Integrasi top-up provider (belum diisi)
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── rate-limit.middleware.js
│   ├── validators/            # Schema validation (product.validator.js)
│   └── utils/
│       ├── response.js
│       └── logger.js
├── database/
│   ├── migrations/            # File SQL migration
│   └── seeders/               # File SQL seeder
├── tests/                     # Test (belum diisi)
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

```bash
npm install
```

## Environment Configuration

Copy `.env.example` menjadi `.env`, lalu sesuaikan:

```bash
cp .env.example .env
```

| Variable | Default | Keterangan |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development` / `production` |
| `PORT` | `3000` | Port HTTP server |
| `DB_HOST` | `localhost` | Host MySQL |
| `DB_PORT` | `3306` | Port MySQL |
| `DB_NAME` | `topup` | Nama database |
| `DB_USER` | `root` | User MySQL |
| `DB_PASSWORD` | _(kosong)_ | Password MySQL |
| `CORS_ORIGIN` | `http://localhost:3000` | Origin yang diizinkan |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Window rate limit (ms) |
| `RATE_LIMIT_MAX` | `100` | Max request per window per IP |
| `DB_CONNECTION_LIMIT` | `10` | Max koneksi pool (opsional) |

Credential database tidak pernah di-hardcode — semua dibaca dari `.env` lewat [`src/config/env.js`](./src/config/env.js).

## Database Configuration

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS topup CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Pool dibuat di [`src/config/database.js`](./src/config/database.js):

```js
const pool = require('./src/config/database');

const [rows] = await pool.query('SELECT 1');
```

`testConnection()` hanya melakukan `ping()` — tidak ada query bisnis di file config.

## Commands

Development (auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

## Available Endpoints

| Method | Endpoint | Deskripsi | Status |
| --- | --- | --- | --- |
| GET | `/` | Info API | 200 |
| GET | `/api/health` | Cek API berjalan | 200 |
| GET | `/api/health/database` | Cek koneksi MySQL | 200 / 503 |
| GET | `/api/products` | List produk top-up (paginated + filter) | 200 |
| GET | `/api/products/:sku` | Detail produk berdasarkan SKU | 200 / 404 |
| ANY | `/api/player` | Placeholder module | 501 |
| ANY | `/api/orders` | Placeholder module | 501 |
| ANY | `/api/payments` | Placeholder module | 501 |
| ANY | `/api/topup` | Placeholder module | 501 |
| ANY | `/api/webhooks` | Placeholder module | 501 |
| ANY | `/api/*` (unknown) | 404 handler | 404 |

Contoh:

```bash
curl http://localhost:3000/api/health
# {"success":true,"message":"API is running"}

curl http://localhost:3000/api/health/database
# {"success":true,"message":"Database connection is healthy"}
```

### Product Module

Query params untuk `GET /api/products`:

| Param | Default | Keterangan |
| --- | --- | --- |
| `game` | - | Filter berdasarkan slug game (contoh `mobile-legends`) |
| `game_id` | - | Filter berdasarkan UUID game |
| `search` | - | Cari di `name` atau `sku` produk |
| `is_active` | `true` | `true`/`false` (produk nonaktif disembunyikan default) |
| `page` | `1` | Halaman (mulai dari 1) |
| `limit` | `10` | Jumlah per halaman (maks 100) |
| `sort_by` | `sort_order` | `id`, `name`, `price`, `sort_order`, `created_at` |
| `sort_dir` | `asc` | `asc` atau `desc` |

Contoh:

```bash
curl "http://localhost:3000/api/products?game=mobile-legends&limit=2&sort_by=price&sort_dir=asc"
curl http://localhost:3000/api/products/MLBB-86
```

Response list menyertakan metadata paginasi:

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "items": [
      {
        "id": "3f1a9c2e-6b4d-4e7a-9f10-2c8d5a1b7e64",
        "game_id": "b7e2d4a0-1c93-4f5b-8a21-6d9e0f3c2a55",
        "game": { "slug": "mobile-legends", "name": "Mobile Legends: Bang Bang" },
        "sku": "MLBB-86",
        "name": "86 Diamonds",
        "description": "86 Diamonds Mobile Legends",
        "price": 20000,
        "original_price": 22000,
        "is_active": true,
        "sort_order": 1
      }
    ],
    "meta": {
      "page": 1,
      "limit": 2,
      "total": 3,
      "total_pages": 2,
      "has_next_page": true,
      "has_prev_page": false
    }
  }
}
```

Data produk diambil dari tabel `games` dan `products`. Jalankan migration lalu seeder sebelum memakai endpoint ini:

```bash
mysql -u root -p topup < database/migrations/001_create_games_and_products.sql
mysql -u root -p topup < database/seeders/001_games_and_products.sql
```

Format response selalu konsisten:

```json
{ "success": true, "message": "...", "data": {} }
{ "success": false, "message": "..." }
```

`data` hanya muncul bila ada. Stack trace hanya muncul di `NODE_ENV !== production`.

## Architecture Overview

Alur request:

```
Route → Controller → Service → Repository → MySQL
```

Untuk API eksternal:

```
Service → Provider → External API
```

Aturan yang berlaku sejak awal:

- Tidak ada query MySQL langsung di controller.
- Tidak ada business logic di route, `app.js`, atau file config.
- Provider eksternal hanya dipanggil dari service.
- Credential hanya dari environment variables.

Lapisan health check sengaja masih sederhana. Modul pertama (**products**) sudah mengikuti alur lengkap `Route → Controller → Service → Repository → MySQL`.

## Roadmap (belum termasuk tahap ini)

- Migration & seeder (`database/migrations`, `database/seeders`)
- Auth & authorization
- Modul products, player, orders
- Integrasi payment gateway (`src/providers/payment`)
- Integrasi top-up provider (`src/providers/topup`)
- Webhook handler idempotent
