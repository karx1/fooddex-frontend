# Fooddex API Hooks - Quick Start Guide

## ✅ What's Been Created

I've created a complete TanStack Query integration for your Fooddex mobile app with the following files:

### 📁 Files Created

1. **`hooks/useApi.ts`** - Main hooks file with all API endpoints
2. **`hooks/README.md`** - Comprehensive documentation with examples
3. **`components/FoodListExample.tsx`** - Working example component
4. **`.env.example`** - Environment configuration template
5. **`components/Provider.tsx`** - Updated with QueryClient setup

## 🚀 Quick Start

### 1. Set up environment variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:

```bash
EXPO_PUBLIC_API_URL=http://localhost:8787
```

### 2. The QueryClient is already configured

The `Provider.tsx` component has been updated to include TanStack Query's QueryClientProvider with sensible defaults.

### 3. Start using the hooks in your components

```tsx
import { useFoods, useCreateFood } from '../hooks/useApi';

function MyComponent() {
  const { data, isLoading } = useFoods();
  const createFood = useCreateFood();

  // Use the data...
}
```

## 📚 Available Hooks

### Query Hooks (GET requests)
- `useFoods()` - List all foods
- `useFood(id)` - Get single food
- `useCaptures()` - List all captures
- `useCapture(id)` - Get single capture
- `useUsers()` - List all users
- `useUser(id)` - Get single user
- `useFavorites()` - List all favorites
- `useFavoritesByUser(userId)` - Get user's favorites
- `useConstellations()` - List all constellations
- `useConstellation(id)` - Get single constellation
- `useConstellationItems()` - List all constellation items
- `useConstellationItemsByConstellation(id)` - Get items in constellation

### Mutation Hooks (POST/PUT/DELETE requests)

#### Foods
- `useCreateFood()` - Create new food
- `useUpdateFood()` - Update existing food
- `useDeleteFood()` - Delete food

#### Captures
- `useCreateCapture()` - Create new capture
- `useUpdateCapture()` - Update capture
- `useDeleteCapture()` - Delete capture

#### Users
- `useCreateUser()` - Create new user
- `useUpdateUser()` - Update user
- `useDeleteUser()` - Delete user

#### Favorites
- `useCreateFavorite()` - Add favorite
- `useDeleteFavorite()` - Remove favorite

#### Constellations
- `useCreateConstellation()` - Create constellation
- `useUpdateConstellation()` - Update constellation
- `useDeleteConstellation()` - Delete constellation

#### Constellation Items
- `useCreateConstellationItem()` - Add item to constellation
- `useDeleteConstellationItem()` - Remove item from constellation

## 💡 Key Features

### ✅ Automatic Cache Management
All mutations automatically invalidate and refetch related queries, keeping your UI in sync.

### ✅ TypeScript Support
Full TypeScript types for all requests and responses.

### ✅ Error Handling
Built-in error handling with detailed error messages.

### ✅ Loading States
Easy access to loading, error, and success states.

### ✅ Optimistic Updates Support
Infrastructure ready for optimistic UI updates (see README for examples).

## 📖 Documentation

For detailed examples and advanced usage, see:
- `hooks/README.md` - Complete documentation with code examples
- `components/FoodListExample.tsx` - Full working example

## 🔧 Example Usage

### Simple Query
```tsx
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

### Simple Mutation
```tsx
function CreateFood() {
  const createFood = useCreateFood({
    onSuccess: (data) => {
      console.log('Created:', data.result.food);
    },
    onError: (error) => {
      console.error('Error:', error.message);
    },
  });

  return (
    <Button
      onPress={() => createFood.mutate({
        foodname: 'Pizza',
        origin: 'Italy',
        rarity: 3,
        description: 'Delicious!'
      })}
      disabled={createFood.isPending}
    >
      {createFood.isPending ? 'Creating...' : 'Create Food'}
    </Button>
  );
}
```

## 🎯 Next Steps

1. ✅ Set up your `.env` file with the API URL
2. ✅ Import and use hooks in your components
3. ✅ Test the example component: `FoodListExample`
4. ✅ Check out `hooks/README.md` for more advanced patterns

## 🐛 Troubleshooting

### API not connecting?
- Check your `.env` file has the correct `EXPO_PUBLIC_API_URL`
- Ensure your backend is running
- Check network permissions in your app

### Types not working?
- All types are exported from `hooks/useApi.ts`
- Import them: `import type { Food, User } from '../hooks/useApi'`

### Cache not updating?
- Mutations automatically invalidate queries
- You can manually invalidate: `queryClient.invalidateQueries({ queryKey: ['foods'] })`

## 📝 Notes

- Query keys are automatically managed for optimal caching
- Stale time is set to 5 minutes by default
- Failed requests are retried once automatically
- All hooks support custom options via TanStack Query's option types

Happy coding! 🚀
