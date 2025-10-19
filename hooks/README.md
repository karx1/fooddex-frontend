# Fooddex API Hooks

This directory contains TanStack Query (React Query) hooks for all Fooddex API endpoints.

## Setup

The QueryClient is already configured in `components/Provider.tsx`. Make sure your app is wrapped with the Provider component.

## Configuration

Set your API base URL in your environment variables:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8787
```

For production:
```bash
EXPO_PUBLIC_API_URL=https://your-worker.workers.dev
```

## Usage Examples

### Foods

#### List all foods
```tsx
import { useFoods } from '../hooks/useApi';

function FoodList() {
  const { data, isLoading, error } = useFoods();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <>
      {data?.result.foods.map(food => (
        <Text key={food.id}>{food.foodname}</Text>
      ))}
    </>
  );
}
```

#### Get a single food
```tsx
import { useFood } from '../hooks/useApi';

function FoodDetail({ foodId }: { foodId: number }) {
  const { data, isLoading } = useFood(foodId);

  if (isLoading) return <Text>Loading...</Text>;

  return <Text>{data?.result.food.foodname}</Text>;
}
```

#### Create a food
```tsx
import { useCreateFood } from '../hooks/useApi';

function CreateFoodForm() {
  const createFood = useCreateFood({
    onSuccess: (data) => {
      console.log('Food created:', data.result.food);
    },
    onError: (error) => {
      console.error('Failed to create food:', error);
    },
  });

  const handleSubmit = () => {
    createFood.mutate({
      foodname: 'Pizza',
      origin: 'Italy',
      rarity: 3,
      description: 'Delicious Italian pizza',
    });
  };

  return (
    <Button onPress={handleSubmit} disabled={createFood.isPending}>
      {createFood.isPending ? 'Creating...' : 'Create Food'}
    </Button>
  );
}
```

#### Update a food
```tsx
import { useUpdateFood } from '../hooks/useApi';

function UpdateFoodForm({ foodId }: { foodId: number }) {
  const updateFood = useUpdateFood({
    onSuccess: () => {
      console.log('Food updated successfully');
    },
  });

  const handleUpdate = () => {
    updateFood.mutate({
      id: foodId,
      data: {
        foodname: 'Updated Pizza',
        rarity: 5,
      },
    });
  };

  return (
    <Button onPress={handleUpdate} disabled={updateFood.isPending}>
      Update Food
    </Button>
  );
}
```

#### Delete a food
```tsx
import { useDeleteFood } from '../hooks/useApi';

function DeleteFoodButton({ foodId }: { foodId: number }) {
  const deleteFood = useDeleteFood({
    onSuccess: () => {
      console.log('Food deleted');
    },
  });

  return (
    <Button onPress={() => deleteFood.mutate(foodId)}>
      Delete
    </Button>
  );
}
```

### Captures

#### List all captures
```tsx
import { useCaptures } from '../hooks/useApi';

function CaptureList() {
  const { data, isLoading } = useCaptures();

  if (isLoading) return <Text>Loading captures...</Text>;

  return (
    <>
      {data?.result.captures.map(capture => (
        <Text key={capture.id}>
          Food ID: {capture.food} - Date: {capture.date}
        </Text>
      ))}
    </>
  );
}
```

#### Create a capture
```tsx
import { useCreateCapture } from '../hooks/useApi';

function CreateCapture({ userId, foodId }: { userId: number; foodId: number }) {
  const createCapture = useCreateCapture({
    onSuccess: () => {
      console.log('Capture created!');
    },
  });

  const handleCapture = () => {
    createCapture.mutate({
      user: userId,
      food: foodId,
      date: new Date().toISOString(),
    });
  };

  return <Button onPress={handleCapture}>Capture Food</Button>;
}
```

### Users

#### List all users
```tsx
import { useUsers } from '../hooks/useApi';

function UserList() {
  const { data } = useUsers();

  return (
    <>
      {data?.result.users.map(user => (
        <Text key={user.id}>{user.username}</Text>
      ))}
    </>
  );
}
```

#### Get a single user
```tsx
import { useUser } from '../hooks/useApi';

function UserProfile({ userId }: { userId: number }) {
  const { data } = useUser(userId);

  return <Text>Username: {data?.result.user.username}</Text>;
}
```

#### Create a user
```tsx
import { useCreateUser } from '../hooks/useApi';

function CreateUserForm() {
  const createUser = useCreateUser();

  const handleSubmit = (username: string) => {
    createUser.mutate({ username });
  };

  return <Button onPress={() => handleSubmit('newuser')}>Create User</Button>;
}
```

### Favorites

#### Get favorites for a user
```tsx
import { useFavoritesByUser } from '../hooks/useApi';

function UserFavorites({ userId }: { userId: number }) {
  const { data, isLoading } = useFavoritesByUser(userId);

  if (isLoading) return <Text>Loading favorites...</Text>;

  return (
    <>
      {data?.result.favorites.map(fav => (
        <Text key={`${fav.user}-${fav.food}`}>Food ID: {fav.food}</Text>
      ))}
    </>
  );
}
```

#### Add a favorite
```tsx
import { useCreateFavorite } from '../hooks/useApi';

function AddFavoriteButton({ userId, foodId }: { userId: number; foodId: number }) {
  const createFavorite = useCreateFavorite({
    onSuccess: () => {
      console.log('Added to favorites!');
    },
  });

  return (
    <Button onPress={() => createFavorite.mutate({ user: userId, food: foodId })}>
      Add to Favorites
    </Button>
  );
}
```

#### Remove a favorite
```tsx
import { useDeleteFavorite } from '../hooks/useApi';

function RemoveFavoriteButton({ userId, foodId }: { userId: number; foodId: number }) {
  const deleteFavorite = useDeleteFavorite({
    onSuccess: () => {
      console.log('Removed from favorites');
    },
  });

  return (
    <Button onPress={() => deleteFavorite.mutate({ userId, foodId })}>
      Remove from Favorites
    </Button>
  );
}
```

### Constellations

#### List all constellations
```tsx
import { useConstellations } from '../hooks/useApi';

function ConstellationList() {
  const { data } = useConstellations();

  return (
    <>
      {data?.result.constellations.map(constellation => (
        <Text key={constellation.id}>
          Constellation {constellation.id} - User: {constellation.user}
        </Text>
      ))}
    </>
  );
}
```

#### Create a constellation
```tsx
import { useCreateConstellation } from '../hooks/useApi';

function CreateConstellation({ userId }: { userId: number }) {
  const createConstellation = useCreateConstellation();

  return (
    <Button onPress={() => createConstellation.mutate({ user: userId })}>
      Create New Constellation
    </Button>
  );
}
```

### Constellation Items

#### Get items in a constellation
```tsx
import { useConstellationItemsByConstellation } from '../hooks/useApi';

function ConstellationItems({ constellationId }: { constellationId: number }) {
  const { data, isLoading } = useConstellationItemsByConstellation(constellationId);

  if (isLoading) return <Text>Loading items...</Text>;

  return (
    <>
      {data?.result.constellationItems.map(item => (
        <Text key={`${item.constellation}-${item.food}`}>
          Food ID: {item.food}
        </Text>
      ))}
    </>
  );
}
```

#### Add item to constellation
```tsx
import { useCreateConstellationItem } from '../hooks/useApi';

function AddToConstellation({ constellationId, foodId }: { constellationId: number; foodId: number }) {
  const createItem = useCreateConstellationItem({
    onSuccess: () => {
      console.log('Added to constellation!');
    },
  });

  return (
    <Button onPress={() => createItem.mutate({ constellation: constellationId, food: foodId })}>
      Add to Constellation
    </Button>
  );
}
```

#### Remove item from constellation
```tsx
import { useDeleteConstellationItem } from '../hooks/useApi';

function RemoveFromConstellation({ constellationId, foodId }: { constellationId: number; foodId: number }) {
  const deleteItem = useDeleteConstellationItem();

  return (
    <Button onPress={() => deleteItem.mutate({ constellationId, foodId })}>
      Remove from Constellation
    </Button>
  );
}
```

## Advanced Usage

### Optimistic Updates

```tsx
import { useUpdateFood } from '../hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';

function OptimisticUpdate({ foodId }: { foodId: number }) {
  const queryClient = useQueryClient();
  const updateFood = useUpdateFood({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['foods', variables.id] });

      // Snapshot previous value
      const previousFood = queryClient.getQueryData(['foods', variables.id]);

      // Optimistically update
      queryClient.setQueryData(['foods', variables.id], (old: any) => ({
        ...old,
        result: {
          food: { ...old.result.food, ...variables.data }
        }
      }));

      return { previousFood };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousFood) {
        queryClient.setQueryData(['foods', variables.id], context.previousFood);
      }
    },
  });

  return <Button onPress={() => updateFood.mutate({ id: foodId, data: { rarity: 5 } })}>Update</Button>;
}
```

### Pagination (if implemented in backend)

```tsx
import { useFoods } from '../hooks/useApi';

function PaginatedFoods() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useFoods({
    // Custom query key for pagination
    queryKey: ['foods', { page }] as any,
  });

  return (
    <>
      {/* Render foods */}
      <Button onPress={() => setPage(p => p + 1)}>Next Page</Button>
    </>
  );
}
```

## API Reference

All hooks follow these patterns:

### Query Hooks
- Return `{ data, isLoading, error, refetch, ... }` from TanStack Query
- Accept optional `UseQueryOptions` for customization
- Automatically cache and refetch data

### Mutation Hooks
- Return `{ mutate, mutateAsync, isPending, isError, error, ... }` from TanStack Query
- Accept optional `UseMutationOptions` for callbacks
- Automatically invalidate related queries on success

## Types

All TypeScript types are exported from `hooks/useApi.ts`:

```tsx
import type { Food, User, Capture, Favorite, Constellation, ConstellationItem } from '../hooks/useApi';
```

## Error Handling

All hooks throw errors that can be caught and displayed:

```tsx
const { data, error } = useFoods();

if (error) {
  return <Text>Error: {error.message}</Text>;
}
```

## Cache Invalidation

Mutations automatically invalidate related queries. You can also manually invalidate:

```tsx
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate all foods queries
queryClient.invalidateQueries({ queryKey: ['foods'] });

// Invalidate specific food
queryClient.invalidateQueries({ queryKey: ['foods', foodId] });
```
