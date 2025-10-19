import { ExternalLink, Heart, Settings } from '@tamagui/lucide-icons';
import { useMemo } from 'react'
import { ActivityIndicator, FlatList, Image } from 'react-native'
import { ToastControl } from 'components/CurrentToast';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { Anchor, H4, H6, Paragraph, XStack, YStack, View, Text, Separator, ListItem, useTheme} from 'tamagui';
// 1. We need to import all necessary data-fetching hooks
import { useCaptures, useFavoritesByUser, useFood, useFoods, useUser, useUsers, CURRENT_USER_ID } from '../../hooks/useApi';

// --- (NewCapturesSetup component is unchanged as it does not contain the error) ---
 
const NewCapturesSetup = ({isCapsLoading, is_error, llogbookEntries}) => {
  // Removed unused theme variable
  // Display a loading indicator while data is being fetched
    if (isCapsLoading) {
      return (
        <View flex={1} alignItems="center" justifyContent="center" bg="$background">
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
      <YStack flex={1} items="flex-start" gap="$8" px="$0" pt="$0" bg="$background">
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
  <YStack
    p="$3" // Padding inside the border
    borderWidth={1}
    borderColor="$gray6" // Example border color
    borderRadius="$4" // Example border radius for rounded corners
    // Add margin/spacing here if needed to separate it from other elements
    // e.g., mb="$3"
  >
    {/* Moved the existing YStack content alignment here for simplicity */}
    <YStack alignItems="center">
      <ListItem
        title={item.foodName}
        subTitle={item.captureDate}
        icon={item.isFavorite ? <Heart size={24} color="$red10" /> : undefined}
      />
    </YStack>
  </YStack>
</Pressable>
            )}
          />
      </YStack>
    </View>
  )
}



// --- FeedSetup component with refactored data fetching ---

const FeedSetup = () => {
  const theme = useTheme()
  // 2. Call all necessary hooks at the top level of the component
  const { data: capturesData, isLoading: isCapturesLoading, error: capturesError } = useCaptures()
  // Assuming you need all users and all foods to resolve names for the feed
  const { data: usersData, isLoading: isUsersLoading, error: usersError } = useUsers()
  const { data: foodsData, isLoading: isFoodsLoading, error: foodsError } = useFoods()
  
  const isLoading = isCapturesLoading || isUsersLoading || isFoodsLoading;
  const error = capturesError || usersError || foodsError;

  if (isLoading) {
    return (
      <View flex={1} alignItems="center" justify="center" bg="$background">
        <Text mt="$2">Loading Captures...</Text>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View flex={1} alignItems="center" justify="center" bg="$background">
        <Text fontSize={20} color="$red10">
          Error loading captures
        </Text>
        <Text mt="$2" color="$color10">
          {error.message}
        </Text>
      </View>
    )
  }

  if (!capturesData?.result.captures || capturesData.result.captures.length === 0) {
    return (
      <YStack flex={1} items="flex-start" gap="$8" px="$10" pt="$5" bg="$background">
        <H4>No Captures Found</H4>
        <Paragraph>There are no captures available at the moment.</Paragraph>
      </YStack>
    )
  }

  // 3. Use useMemo to process the data efficiently after all data is loaded
  const capturesWithUsernames = useMemo(() => {
    if (!capturesData?.result.captures || !usersData?.result.users || !foodsData?.result.foods) {
      return [];
    }

    // Create efficient lookup maps
    const userMap = new Map(usersData.result.users.map((user) => [user.id, user.username]));
    const foodMap = new Map(foodsData.result.foods.map((food) => [food.id, food.foodname]));

    return capturesData.result.captures.map((capture) => ({
      ...capture,
      // Resolve names using the maps
      username: userMap.get(capture.user) || 'Unknown User',
      foodname: foodMap.get(capture.food) || 'Unknown Food',
    }));
  }, [capturesData, usersData, foodsData]); // Depend on all data sources

  return (
    <FlatList
      data={capturesWithUsernames}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <YStack flex={1} items="flex-start" gap="$0" px="$10" pt="$5" bg="$background">
          <Paragraph>{item.username} got a new catch!</Paragraph>
          <Pressable>
            <YStack
              p="$3"
              borderWidth={1}
              borderColor="$gray6"
              borderRadius="$4"
            >
              <XStack alignItems="center" gap="$4">
                {/* 1. Image YStack - This sets the overall height on the left side */}
                <YStack>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/50' }}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                  />
                </YStack>

                {/* 2. Text YStack - ADD 'flex={1}' and 'alignSelf="stretch"' here */}
                <YStack flex={1} alignSelf="stretch">
                  <Text>{item.foodname}</Text>
                  <Text
                    fontSize="$2"
                    color="$gray"
                    ml="$2"
                  >
                    {new Date(item.date).toLocaleDateString()}
                  </Text>
                </YStack>
              </XStack>
            </YStack>
          </Pressable>
        </YStack>
      )}
    />
  );
}

// --- (HomeScreen component is unchanged) ---

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
    
    <YStack flex={1} items="flex-start" gap="$2" px="$10" pt="$5" bg="$background">
      <NewCapturesSetup 
      isCapsLoading={isLoading} 
      isError={error} 
      llogbookEntries={logbookEntries} 
      />
      <H4>Feed</H4>
      <FeedSetup />
    </YStack>
)
}