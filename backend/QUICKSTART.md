# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- Cloudflare account (for deployment)
- Wrangler CLI installed globally: `npm install -g wrangler`

## Setup Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Initialize the Database

The database binding is already configured in `wrangler.jsonc`. Initialize the schema:

**For Local Development:**
```bash
# Create local D1 database and tables
wrangler d1 execute foodex_db --local --file=schema.sql
```

**For Production:**
```bash
# Create tables in production D1 database
wrangler d1 execute foodex_db --file=schema.sql
```

### 3. Run Development Server

```bash
npm run dev
```

The server will start at `http://localhost:8787`

### 4. Access Interactive Documentation

Open your browser and navigate to:
```
http://localhost:8787
```

You'll see the Swagger UI with all API endpoints documented. You can test endpoints directly from this interface!

## Testing the API

### Using the Swagger UI

1. Open `http://localhost:8787`
2. Click on any endpoint to expand it
3. Click "Try it out"
4. Fill in the request body or parameters
5. Click "Execute"
6. View the response

### Using cURL

**Create a User:**
```bash
curl -X POST http://localhost:8787/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe"}'
```

**Create a Food:**
```bash
curl -X POST http://localhost:8787/api/foods \
  -H "Content-Type: application/json" \
  -d '{
    "rarity": 5,
    "origin": "Japan",
    "foodname": "Sushi",
    "photo_url": "https://example.com/sushi.jpg"
  }'
```

**List All Foods:**
```bash
curl http://localhost:8787/api/foods
```

**Get Food by ID:**
```bash
curl http://localhost:8787/api/foods/1
```

**Update a Food:**
```bash
curl -X PUT http://localhost:8787/api/foods/1 \
  -H "Content-Type: application/json" \
  -d '{"rarity": 10}'
```

**Delete a Food:**
```bash
curl -X DELETE http://localhost:8787/api/foods/1
```

### Example Workflow

```bash
# 1. Create a user
curl -X POST http://localhost:8787/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "alice"}'
# Response: {"success":true,"result":{"user":{"id":1,"username":"alice"}}}

# 2. Create a food
curl -X POST http://localhost:8787/api/foods \
  -H "Content-Type: application/json" \
  -d '{
    "rarity": 8,
    "origin": "Italy",
    "foodname": "Pizza Margherita",
    "photo_url": "https://example.com/pizza.jpg"
  }'
# Response: {"success":true,"result":{"food":{...}}}

# 3. Create a capture
curl -X POST http://localhost:8787/api/captures \
  -H "Content-Type: application/json" \
  -d '{
    "food": 1,
    "user": 1,
    "date": "2025-10-18T12:00:00Z"
  }'

# 4. Add to favorites
curl -X POST http://localhost:8787/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"user": 1, "food": 1}'

# 5. Create a constellation
curl -X POST http://localhost:8787/api/constellations \
  -H "Content-Type: application/json" \
  -d '{"user": 1}'

# 6. Add food to constellation
curl -X POST http://localhost:8787/api/constellation-items \
  -H "Content-Type: application/json" \
  -d '{"constellation": 1, "food": 1}'
```

## Deployment

### Deploy to Cloudflare Workers

```bash
npm run deploy
```

Your API will be deployed to: `https://backend.YOUR_SUBDOMAIN.workers.dev`

### Update Production Database

After deploying, initialize the production database:

```bash
wrangler d1 execute foodex_db --file=schema.sql
```

## Troubleshooting

### Database Not Found

If you get a "database not found" error:

1. Check that the database exists:
   ```bash
   wrangler d1 list
   ```

2. If it doesn't exist, create it:
   ```bash
   wrangler d1 create foodex-db
   ```

3. Update the `database_id` in `wrangler.jsonc` with the new ID

### Local Development Issues

Clear local D1 cache:
```bash
rm -rf .wrangler
```

Then restart the dev server:
```bash
npm run dev
```

### Type Errors

Regenerate Cloudflare Worker types:
```bash
npm run cf-typegen
```

## Next Steps

1. **Add Sample Data**: Use the Swagger UI or cURL to populate your database with test data
2. **Integrate with Frontend**: Update your frontend app to call these API endpoints
3. **Add Authentication**: Implement user authentication for secure endpoints
4. **Add Validation**: Enhance Zod schemas with additional validation rules
5. **Add Pagination**: Implement pagination for list endpoints
6. **Add Search/Filter**: Add query parameters for filtering and searching

## Documentation

- **API Documentation**: See `API_DOCUMENTATION.md`
- **OpenAPI Spec**: See `openapi.yaml`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`

## Support

For issues with:
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **D1 Database**: https://developers.cloudflare.com/d1/
- **Kysely**: https://kysely.dev/
- **Hono**: https://hono.dev/
- **Chanfana**: https://github.com/cloudflare/chanfana
