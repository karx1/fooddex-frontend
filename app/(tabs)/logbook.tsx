import { Heart } from '@tamagui/lucide-icons'
import { useMemo } from 'react'
import { ActivityIndicator, FlatList } from 'react-native'
import { H4, ListItem, Separator, Text, View, YStack } from 'tamagui'
import { useCaptures, useFavoritesByUser, useFoods } from '../../hooks/useApi'

// In a real application, you would get the current user's ID from an
// authentication context or state management solution.
const CURRENT_USER_ID = 'user_2a7x1y9w0z8v3q5p'

export default function LogbookScreen() {
  // Fetch all the data required for the logbook from the API
  const { data: capturesData, isLoading: isCapturesLoading, error: capturesError } = useCaptures()
  const { data: foodsData, isLoading: isFoodsLoading, error: foodsError } = useFoods()
  const {
    data: favoritesData,
    isLoading: isFavoritesLoading,
    error: favoritesError,
  } = useFavoritesByUser(CURRENT_USER_ID)

  // Consolidate loading and error states from all API calls
  const isLoading = isCapturesLoading || isFoodsLoading || isFavoritesLoading
  const error = capturesError || foodsError || favoritesError

  // Process and combine the data once all requests are successful.
  // useMemo ensures this complex logic only runs when the source data changes.
  const logbookEntries = useMemo(() => {
    if (!capturesData?.result.captures || !foodsData?.result.foods) {
      return []
    }

    // Create efficient data structures for quick lookups
    const foodMap = new Map(foodsData.result.foods.map((food) => [food.id, food]))
    const favoriteFoodIds = new Set(favoritesData?.result.favorites.map((fav) => fav.food) ?? [])

    // Filter captures for the current user and map them to a display-friendly format
    const processed = capturesData.result.captures
      .filter((capture) => capture.user === CURRENT_USER_ID)
      .map((capture) => {
        const food = foodMap.get(capture.food)
        return {
          id: capture.id,
          foodName: food?.foodname ?? 'Unknown Food',
          captureDate: new Date(capture.date).toLocaleDateString(),
          isFavorite: favoriteFoodIds.has(capture.food),
        }
      })

    // Sort entries by date, with the most recent captures first
    return processed.sort((a, b) => new Date(b.captureDate).getTime() - new Date(a.captureDate).getTime())
  }, [capturesData, foodsData, favoritesData])

  // Display a loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View flex={1} verticalAlign="center" justify="center" bg="$background">
        <ActivityIndicator size="large" />
        <Text mt="$2">Loading Logbook...</Text>
      </View>
    )
  }

  // Display an error message if any of the API calls fail
  if (error) {
    return (
      <View flex={1} verticalAlign="center" justify="center" bg="$background">
        <Text fontSize={20} color="$red10">
          Error loading data
        </Text>
        <Text mt="$2" color="$color10">
          {error.message}
        </Text>
      </View>
    )
  }

  // Display a message if the user has no captures
  if (logbookEntries.length === 0) {
    return (
      <View flex={1} verticalAlign="center" justify="center" bg="$background">
        <H4>Logbook is Empty</H4>
        <Text mt="$2" color="$color10">
          Go capture some new foods!
        </Text>
      </View>
    )
  }

  // Render the final list of logbook entries
  return (
    <YStack flex={1} bg="$background" pt="$8">
      <H4 px="$4" pb="$2">
        My Captures
      </H4>
      <FlatList
        data={logbookEntries}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Separator marginInline="$4" />}
        renderItem={({ item }) => (
          <ListItem
            title={item.foodName}
            subTitle={item.captureDate}
            icon={item.isFavorite ? <Heart size={24} color="$red10" /> : undefined}
          />
        )}
      />
    </YStack>
  )
}