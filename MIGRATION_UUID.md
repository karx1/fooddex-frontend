# Migration: Integer IDs to UUIDs

This document outlines the changes made to migrate all ID fields from integers to UUIDs across the Fooddex application.

## Overview

All primary keys and foreign keys have been changed from integer types to UUID (string) types throughout the application stack:
- Database schema
- Backend API types and endpoints
- Frontend TypeScript types and API hooks
- OpenAPI specification

## Database Schema Changes

### File: `backend/schema.sql`

All ID columns changed from `INTEGER PRIMARY KEY AUTOINCREMENT` to `TEXT PRIMARY KEY`:

- `foods.id`: INTEGER → TEXT
- `users.id`: INTEGER → TEXT  
- `captures.id`: INTEGER → TEXT
- `captures.food`: INTEGER → TEXT (foreign key)
- `captures.user`: INTEGER → TEXT (foreign key)
- `constellations.id`: INTEGER → TEXT
- `constellations.user`: INTEGER → TEXT (foreign key)
- `favorites.user`: INTEGER → TEXT (foreign key)
- `favorites.food`: INTEGER → TEXT (foreign key)
- `constellation_items.food`: INTEGER → TEXT (foreign key)
- `constellation_items.constellation`: INTEGER → TEXT (foreign key)

## Backend Changes

### Type Definitions: `backend/src/types.ts`

#### Zod Schema Changes
All ID fields changed from `Int()` to `Str()`:

```typescript
// Before
export const Food = z.object({
  id: Int(),
  // ...
});

// After
export const Food = z.object({
  id: Str(),
  // ...
});
```

Applied to:
- `Food.id`
- `User.id`
- `Capture.id`, `Capture.food`, `Capture.user`
- `Constellation.id`, `Constellation.user`
- `Favorite.user`, `Favorite.food`
- `ConstellationItem.food`, `ConstellationItem.constellation`

#### Database Interface Changes
All ID fields in the `Database` interface changed from `number` to `string`:

```typescript
export interface Database {
  foods: {
    id: string;  // was: number
    // ...
  };
  // ... other tables
}
```

### API Endpoint Changes

#### Create Endpoints
All create endpoints now generate UUIDs before inserting:

**Files Updated:**
- `backend/src/endpoints/foods/foodCreate.ts`
- `backend/src/endpoints/users/userCreate.ts`
- `backend/src/endpoints/captures/captureCreate.ts`
- `backend/src/endpoints/constellations/constellationCreate.ts`

```typescript
// Before
const result = await db
  .insertInto("foods")
  .values(data.body)
  .returning([...])
  .executeTakeFirstOrThrow();

// After
const id = crypto.randomUUID();
const result = await db
  .insertInto("foods")
  .values({
    ...data.body,
    id,
  })
  .returning([...])
  .executeTakeFirstOrThrow();
```

#### Fetch/Update/Delete Endpoints
All parameter types changed from `Int()` to `Str()`:

**Files Updated:**
- `backend/src/endpoints/foods/*`
- `backend/src/endpoints/users/*`
- `backend/src/endpoints/captures/*`
- `backend/src/endpoints/constellations/*`
- `backend/src/endpoints/favorites/*`

```typescript
// Before
params: z.object({
  id: Int({ description: "Food ID" }),
}),

// After
params: z.object({
  id: Str({ description: "Food ID" }),
}),
```

### OpenAPI Specification: `backend/openapi.yaml`

All ID fields changed from `type: integer` to `type: string` with `format: uuid`:

```yaml
# Before
id:
  type: integer
  description: Unique identifier

# After
id:
  type: string
  format: uuid
  description: Unique identifier
```

Changes applied to:
- All schema definitions (Food, User, Capture, Constellation, etc.)
- All path parameters
- All request/response schemas

## Frontend Changes

### API Hook Types: `hooks/useApi.ts`

All ID types changed from `number` to `string`:

```typescript
// Before
export interface Food {
  id: number;
  // ...
}

// After
export interface Food {
  id: string;
  // ...
}
```

Applied to all interfaces:
- `Food`, `User`, `Capture`, `Constellation`
- `CaptureCreate`, `CaptureUpdate`
- `Favorite`, `ConstellationItem`

### Hook Function Signatures

All hook functions accepting IDs now use `string` instead of `number`:

```typescript
// Before
export function useFood(id: number, options?: ...) { ... }
export function useUpdateFood(options?: UseMutationOptions<..., { id: number; ... }>) { ... }

// After
export function useFood(id: string, options?: ...) { ... }
export function useUpdateFood(options?: UseMutationOptions<..., { id: string; ... }>) { ... }
```

### Component Updates: `components/FoodListExample.tsx`

State and function parameters updated:

```typescript
// Before
const [editingId, setEditingId] = useState<number | null>(null);
const handleUpdateFood = (id: number, newName: string) => { ... }
const handleDeleteFood = (id: number) => { ... }

// After
const [editingId, setEditingId] = useState<string | null>(null);
const handleUpdateFood = (id: string, newName: string) => { ... }
const handleDeleteFood = (id: string) => { ... }
```

## Migration Steps

To migrate an existing database:

1. **Backup existing data** (if any exists)

2. **Drop and recreate tables** using the new schema:
   ```sql
   -- Run the updated schema.sql file
   ```

3. **If preserving data**, you'll need to:
   - Export existing data
   - Generate UUIDs for all records
   - Update all foreign key references
   - Re-import with new UUIDs

## Benefits of UUID Migration

1. **Globally Unique**: UUIDs are globally unique across all tables and systems
2. **Security**: Harder to enumerate/guess compared to sequential integers
3. **Distributed Systems**: Can generate IDs on any client without coordination
4. **No Auto-increment**: No dependency on database-specific auto-increment features
5. **Merging Data**: Easier to merge data from multiple sources without ID conflicts

## Testing Recommendations

1. Test all CRUD operations for each entity type
2. Verify UUID generation works correctly
3. Test foreign key relationships
4. Verify API responses match the updated OpenAPI spec
5. Test frontend components with UUID values

## Notes

- UUIDs are generated using `crypto.randomUUID()` which generates v4 UUIDs
- SQLite stores UUIDs as TEXT type
- All UUIDs are in the standard format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- No data migration script is provided as this is a breaking change requiring fresh database initialization
