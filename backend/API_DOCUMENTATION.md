# Fooddex API Documentation

This is the complete OpenAPI documentation for the Fooddex backend API. The API provides CRUD operations for all database entities.

## Base URL

When running locally: `http://localhost:8787`

## Interactive Documentation

Visit the root URL (`/`) to access the interactive OpenAPI documentation with Swagger UI.

## API Endpoints

### Foods

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods` | List all foods |
| POST | `/api/foods` | Create a new food |
| GET | `/api/foods/:id` | Get a food by ID |
| PUT | `/api/foods/:id` | Update a food |
| DELETE | `/api/foods/:id` | Delete a food |

**Food Schema:**
```json
{
  "id": 1,
  "rarity": 5,
  "origin": "Japan",
  "foodname": "Sushi",
  "photo_url": "https://example.com/sushi.jpg"
}
```

### Captures

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/captures` | List all captures |
| POST | `/api/captures` | Create a new capture |
| GET | `/api/captures/:id` | Get a capture by ID |
| PUT | `/api/captures/:id` | Update a capture |
| DELETE | `/api/captures/:id` | Delete a capture |

**Capture Schema:**
```json
{
  "id": 1,
  "food": 1,
  "date": "2025-10-18T12:00:00Z",
  "user": 1
}
```

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/:id` | Get a user by ID |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

**User Schema:**
```json
{
  "id": 1,
  "username": "johndoe"
}
```

### Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | List all favorites |
| POST | `/api/favorites` | Create a new favorite |
| GET | `/api/favorites/user/:userId` | Get all favorites for a user |
| DELETE | `/api/favorites/user/:userId/food/:foodId` | Remove a favorite |

**Favorite Schema:**
```json
{
  "user": 1,
  "food": 1
}
```

### Constellations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/constellations` | List all constellations |
| POST | `/api/constellations` | Create a new constellation |
| GET | `/api/constellations/:id` | Get a constellation by ID |
| PUT | `/api/constellations/:id` | Update a constellation |
| DELETE | `/api/constellations/:id` | Delete a constellation |

**Constellation Schema:**
```json
{
  "id": 1,
  "user": 1
}
```

### Constellation Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/constellation-items` | List all constellation items |
| POST | `/api/constellation-items` | Create a new constellation item |
| GET | `/api/constellation-items/constellation/:constellationId` | Get all items in a constellation |
| DELETE | `/api/constellation-items/constellation/:constellationId/food/:foodId` | Remove an item from a constellation |

**Constellation Item Schema:**
```json
{
  "food": 1,
  "constellation": 1
}
```

## Response Format

All successful responses follow this format:

```json
{
  "success": true,
  "result": {
    // Response data here
  }
}
```

Error responses (4xx, 5xx):

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Database Schema

The API is built on the following database schema:

```
Table foods {
  id integer [primary key]
  rarity integer
  origin varchar
  foodname varchar
  photo_url varchar
}

Table captures {
  food integer
  id integer [primary key]
  date datetime
  user integer
}

Table users {
  id integer [primary key]
  username varchar
}

Table favorites {
  user integer 
  food integer
}

Table constellations {
  user integer 
  id integer [primary key]
}

Table constellation_items {
  food integer
  constellation integer
}
```

## Technology Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono + Chanfana (OpenAPI)
- **Database**: Cloudflare D1 (SQLite)
- **Query Builder**: Kysely
- **Validation**: Zod

## Development

### Running Locally

```bash
cd backend
npm run dev
```

Visit `http://localhost:8787` to see the interactive API documentation.

### Deploying

```bash
npm run deploy
```

## Database Setup

Make sure your D1 database is initialized with the correct schema. You can create the tables using the schema provided above.

Example SQL to create the tables:

```sql
CREATE TABLE foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rarity INTEGER NOT NULL,
  origin VARCHAR NOT NULL,
  foodname VARCHAR NOT NULL,
  photo_url VARCHAR NOT NULL
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR NOT NULL
);

CREATE TABLE captures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  food INTEGER NOT NULL,
  date DATETIME NOT NULL,
  user INTEGER NOT NULL,
  FOREIGN KEY (food) REFERENCES foods(id),
  FOREIGN KEY (user) REFERENCES users(id)
);

CREATE TABLE favorites (
  user INTEGER NOT NULL,
  food INTEGER NOT NULL,
  PRIMARY KEY (user, food),
  FOREIGN KEY (user) REFERENCES users(id),
  FOREIGN KEY (food) REFERENCES foods(id)
);

CREATE TABLE constellations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user INTEGER NOT NULL,
  FOREIGN KEY (user) REFERENCES users(id)
);

CREATE TABLE constellation_items (
  food INTEGER NOT NULL,
  constellation INTEGER NOT NULL,
  PRIMARY KEY (food, constellation),
  FOREIGN KEY (food) REFERENCES foods(id),
  FOREIGN KEY (constellation) REFERENCES constellations(id)
);
```
