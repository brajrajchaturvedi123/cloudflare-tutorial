# Tutorial Project

React + Vite frontend on Cloudflare Pages with HonoJS API Worker using D1 and R2.

## Prerequisites

- Node.js 18+
- pnpm installed (`npm install -g pnpm`)
- Wrangler CLI installed (`npm install -g wrangler`)
- Cloudflare account

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Cloudflare Login

```bash
wrangler login
```

### 3. Create D1 Database

```bash
wrangler d1 create todo-db
```

The output will look like:

```
✅ Successfully created DB 'todo-db'
database_id = "xxxx-xxxx-xxxx-xxxx-xxxx"
```

Copy the `database_id` value (the UUID string).

### 4. Create R2 Bucket

```bash
wrangler r2 bucket create tutorial-images
```

### 5. Update Cloudflare Bindings

Open the file `apps/api/wrangler.toml` and update the database_id:

**Before:**

```toml
[[d1_databases]]
binding = "DB"
database_name = "todo-db"
database_id = "YOUR_DATABASE_ID"
preview_database_id = "YOUR_DATABASE_ID"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "tutorial-images"
preview_bucket_name = "tutorial-images"
```

**After:**

```toml
[[d1_databases]]
binding = "DB"
database_name = "todo-db"
database_id = "xxxx-xxxx-xxxx-xxxx-xxxx"
preview_database_id = "xxxx-xxxx-xxxx-xxxx-xxxx"
```

Replace `YOUR_DATABASE_ID` with the actual database_id from step 3 in both `database_id` and `preview_database_id` fields (using the same value allows you to use the same database for development and production).

The R2 bucket binding is already configured with `preview_bucket_name` to use the same bucket for development and production:

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "tutorial-images"
preview_bucket_name = "tutorial-images"
```

### 6. Apply Database Schema

```bash
cd apps/api
wrangler d1 execute todo-db --remote --file=schema.sql
```

## Local Development

### Start API Worker (connects to remote D1/R2)

```bash
pnpm dev:api
```

API will run on `http://localhost:8787`

### Start Frontend

```bash
pnpm dev:web
```

Frontend will run on `http://localhost:5173` and proxy `/api` requests to the Worker.

## Environment Variables

For production, set `VITE_API_URL` in Cloudflare Pages environment variables to your Worker URL.

## Deployment

### Deploy API Worker

```bash
pnpm deploy:api
```

Note the Worker URL after deployment.

### Deploy Frontend

```bash
cd apps/web
pnpm build
wrangler pages deploy dist
```

Set `VITE_API_URL` environment variable in Cloudflare Pages dashboard to your Worker URL.
