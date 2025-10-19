import { ExternalLink, Heart, Settings } from '@tamagui/lucide-icons';
import { useMemo } from 'react'
import { ActivityIndicator, FlatList } from 'react-native'
import { ToastControl } from 'components/CurrentToast';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { Anchor, H4, H6, Paragraph, XStack, YStack, View, Text, Separator, ListItem, useTheme} from 'tamagui';
import { useCaptures, useFavoritesByUser, useFoods, CURRENT_USER_ID } from '../../hooks/useApi';
 
const NewCapturesSetup = ({isCapsLoading, is_error, llogbookEntries}) => {
  const theme = useTheme()
  // Display a loading indicator while data is being fetched
    if (isCapsLoading) {
      return (
        <View flex={1} alignItems="center" justify="center" bg="$background">
          <Text mt="$2">Loading Logbook...</Text>
          <ActivityIndicator size="large" />
        </View>
      )
    }
  
    // Display an error message if any of the API calls fail
    if (is_error) {
      return (
        <View flex={1} alignItems="center" justify="center" bg="$background">
          <Text fontSize={20} color="$red10">
            Error loading data
          </Text>
          <Text mt="$2" color="$color10">
            {is_error.message}
          </Text>
        </View>
      )
    }
  
    // Display a message if the user has no captures
    if (llogbookEntries.length == 0 && false) {
      return (
      <YStack flex={1} items="flex-start" gap="$8" px="$10" pt="$5" bg="$background">
        <H4>New Captures</H4>

        <H6>No captures logged. Go capture!</H6>
          
      </YStack>
  )
    }
  return (
    <View>
      <YStack flex={1} items="flex-start" gap="$8" px="$10" pt="$5" bg="$background">
        <H4>New Captures</H4>
          
      </YStack>
      <YStack flex={1} items="center" justify="center" bg="$background">

        <FlatList
            data={llogbookEntries}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={200} // Adjust this value based on item width
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: 16,
              backgroundColor: '$background', // Set the background color here
            }}
            ItemSeparatorComponent={() => <Separator marginInline="$4" />}
            renderItem={({ item }) => (
              <Pressable>
                <YStack alignItems="center" mx="$4">
                  <ListItem
                    title={item.foodName}
                    subTitle={item.captureDate}
                    icon={item.isFavorite ? <Heart size={24} color="$red10" /> : undefined}
                  />
                </YStack>
              </Pressable>
            )}
          />
      </YStack>
    </View>
  )
}

export default function HomeScreen() {
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
  return (
    
    <YStack flex={1} items="flex-start" gap="$8" px="$10" pt="$5" bg="$background">
      <NewCapturesSetup 
      isCapsLoading={isLoading} 
      isError={error} 
      llogbookEntries={logbookEntries} 
      />

      
    </YStack>
)
}
