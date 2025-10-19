import { Heart } from "@tamagui/lucide-icons";
import { useMemo } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import {
  H4,
  ListItem,
  Separator,
  Text,
  View,
  YStack,
  Card,
  H2,
  Paragraph,
  XStack,
  Button,
  Image,
  H3,
  H5,
} from "tamagui";
import {
  useCaptures,
  useFavoritesByUser,
  useFoods,
  CURRENT_USER_ID,
  BUCKET_PREFIX
} from "../../hooks/useApi";
import { router } from 'expo-router';

export default function LogbookScreen() {
  // Fetch all the data required for the logbook from the API
  const {
    data: capturesData,
    isLoading: isCapturesLoading,
    error: capturesError,
  } = useCaptures();
  const {
    data: foodsData,
    isLoading: isFoodsLoading,
    error: foodsError,
  } = useFoods();
  const {
    data: favoritesData,
    isLoading: isFavoritesLoading,
    error: favoritesError,
  } = useFavoritesByUser(CURRENT_USER_ID);

  // Consolidate loading and error states from all API calls
  const isLoading = isCapturesLoading || isFoodsLoading || isFavoritesLoading;
  const error = capturesError || foodsError || favoritesError;

  // Process and combine the data once all requests are successful.
  // useMemo ensures this complex logic only runs when the source data changes.
  const logbookEntries = useMemo(() => {
    if (!capturesData?.result.captures || !foodsData?.result.foods) {
      return [];
    }

    // Create efficient data structures for quick lookups
    const foodMap = new Map(
      foodsData.result.foods.map((food) => [food.id, food])
    );
    const favoriteFoodIds = new Set(
      favoritesData?.result.favorites.map((fav) => fav.food) ?? []
    );
    // Filter captures for the current user and map them to a display-friendly format
    const processed = capturesData.result.captures
      .filter((capture) => capture.user === CURRENT_USER_ID)
      .map((capture) => {
        const food = foodMap.get(capture.food);
        return {
          id: capture.id,
          foodName: food?.foodname ?? "Unknown Food",
          captureDate: new Date(capture.date).toLocaleString(undefined, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          isFavorite: favoriteFoodIds.has(capture.food),
          image_url: capture.image_url,
        };
      });

    // Sort entries by date, with the most recent captures first
    return processed.sort(
      (a, b) =>
        new Date(b.captureDate).getTime() - new Date(a.captureDate).getTime()
    );
  }, [capturesData, foodsData, favoritesData]);

  // Display a loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View flex={1} alignItems="center" justify="center" bg="$background">
        <Text mt="$2">Loading Logbook...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Display an error message if any of the API calls fail
  if (error) {
    return (
      <View flex={1} alignItems="center" justify="center" bg="$background">
        <Text fontSize={20} color="$red10">
          Error loading data
        </Text>
        <Text mt="$2" color="$color10">
          {error.message}
        </Text>
      </View>
    );
  }

  // Display a message if the user has no captures
  if (logbookEntries.length === 0) {
    return (
      <View flex={1} alignItems="center" justify="center" bg="$background">
        <H4>Logbook is Empty</H4>
        <Text mt="$2" color="$color10">
          Go capture some new foods!
        </Text>
      </View>
    );
  }

  // Render the final list of logbook entries
  return (
    <YStack flex={1} bg="$background" pt="$1">
      <H4 pb="$2" pl="$4">My Captures</H4>
      <FlatList
        data={logbookEntries}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          gap: 12,
          paddingHorizontal: 12,
        }}
        contentContainerStyle={{
          paddingBottom: 16,
        }}
        renderItem={({ item }) => (
          <Card
            elevate
            size="$4"
            bordered
            marginVertical="$2"
            flex={1}
            overflow="hidden"
            height={250}
          >
            <Card.Header padded>
              <H5 style={{
                textShadowColor: 'rgba(0, 0, 0, 0.5)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2
              }}>{item.foodName}</H5>
              <Paragraph theme="alt2">{item.captureDate}</Paragraph>
            </Card.Header>
            <Card.Footer padded>
                {item.isFavorite && (
                <View
                  backgroundColor="$background"
                  padding="$3"
                  borderRadius="$10"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Heart size={18} color="$color10" />
                </View>
              )}
              <XStack flex={1} />
              <Button borderRadius="$10" onPress={() => router.push({
                                pathname: '/foodcard',
                                params: {
                                    foodname: item.foodName,
                                    image_id: item.image_url.replaceAll(BUCKET_PREFIX + '/', ''),
                                    show_add: 'false',
                                    capture_id: item.id
                                }
              })}>Details</Button>
            </Card.Footer>

            <Card.Background>
              <Image
                resizeMode="cover"
                width="100%"
                height="100%"
                source={{
                  uri: item.image_url,
                }}
              />
            </Card.Background>
          </Card>
        )}
      />
    </YStack>
  );
}
