import { Button, Card, H2, H3, Input, Paragraph, Stack, Text, XStack, YStack, Avatar, View, Image } from 'tamagui'
import { X, Menu, Camera, Plus, Trash, Heart, HeartPlus } from '@tamagui/lucide-icons'
import { Route, router, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import { BUCKET_PREFIX, CaptureCreate, CURRENT_USER_ID, useCreateCapture, useCreateFavorite, useDeleteCapture, useDeleteFavorite, useFavoritesByUser, useFoodByName, useFoodTotalCaptures } from 'hooks/useApi';
import { useEffect, useMemo, useState } from 'react';

type FoodPicScreenParams = {
  foodname: string;
  image_id: string;
  show_add?: string;
  capture_id?: string;
}

export default function FoodPicScreen() {
  const { foodname, image_id, show_add, capture_id } = useLocalSearchParams<FoodPicScreenParams>();
  const {data: foodData, isLoading, error} = useFoodByName(foodname as string);
  console.log('hi' + image_id)
  const [uploadLoading, setUploadLoading] = useState(false);
  const {data: favoritesData, isLoading: isFavoritesLoading, error: favoritesError, refetch} = useFavoritesByUser(CURRENT_USER_ID); 

  const food = useMemo(() => {
    if (!isLoading) {
      if (!foodData?.result.food) return null;
      console.log(foodData);
      return foodData.result.food;
    } else {
      return null;
    }
  }, [isLoading, foodData]);

  const parsedShowAdd = useMemo(() => show_add && show_add === '1', [show_add]);

  const { data: capturesData, isLoading: isCapturesLoading, error: capturesError } = useFoodTotalCaptures(food?.id || '', {
    enabled: !!food,
  });

  const captures = useMemo(() => {
    if (!isCapturesLoading) {
      console.log(capturesData);
      return capturesData?.result.captures;
    } else {
      return null;
    }
  }, [isCapturesLoading, capturesData]);

  const favorite = useMemo(() => {
    if (isLoading || isFavoritesLoading) return false;

    for (const fav of favoritesData?.result.favorites || []) {
      if (fav.food === food?.id) {
        return true;
      }
    }

    return false;
  }, [favoritesData, food, isLoading, isFavoritesLoading]);

  const imageUrl = `${BUCKET_PREFIX}/${image_id}`;

  const captureCreateMutator = useCreateCapture({
    onSuccess: () => {
      setUploadLoading(false);
      console.log('Capture created successfully!');
      router.back();
    },
    onError: (error) => {
      console.error('Failed to create capture:', error.message);
    },
  })

  const createCapture = () => {
    setUploadLoading(true);
    const capture: CaptureCreate = {
      food: food?.id!,
      date: new Date().toISOString(),
      user: CURRENT_USER_ID, // hardcoding for now, very very very hacky
      image_url: imageUrl,
    };


    captureCreateMutator.mutate(capture);
  };

  const captureDeleteMutator = useDeleteCapture({
    onSuccess: () => {
      setUploadLoading(false);
      console.log('Capture deleted successfully!');
      router.back();
    },
    onError: (error) => {
      console.error('Failed to delete capture:', error.message);
    },
  });

  const deleteCapture = () => {
    setUploadLoading(true);
    captureDeleteMutator.mutate(capture_id!); // we can use ! here because we know it's defined if we're deleting
  };

  const favoriteCreateMutator = useCreateFavorite({
    onSuccess: () => {
      console.log('Favorite created successfully!');
      refetch(); // refetch favorites after creating a new one
    },
    onError: (error) => {
      console.error('Failed to create favorite:', error.message);
    },
  });

  const handleFavorite = () => {
    const favoriteData = {
      user: CURRENT_USER_ID,
      food: food?.id!,
    };

    favoriteCreateMutator.mutate(favoriteData);
  };

  const favoriteDeleteMutator = useDeleteFavorite({
    onSuccess: () => {
      console.log('Favorite deleted successfully!');
      refetch(); // refetch favorites after deleting one
    },
    onError: (error) => {
      console.error('Failed to delete favorite:', error.message);
    },
  });

  const handleDeleteFavorite = () => {
    const deleteData: { userId: string; foodId: string } = {
      userId: CURRENT_USER_ID,
      foodId: food?.id!,
    };

    favoriteDeleteMutator.mutate(deleteData);
  }


  if (isLoading || isCapturesLoading || isFavoritesLoading) {
    return (
      <YStack flex={1} ai="center" jc="center" bg="$background">
          <Text mt="$2">Loading Logbook...</Text>
          <ActivityIndicator size="large" />
      </YStack>
    )
  }

  if (error || capturesError || favoritesError) {
    return (
      <YStack flex={1} alignItems="center" justify="center" bg="$background">
        <Text fontSize={20} color="$red10">
          Error loading data
        </Text>
        <Text mt="$2" color="$color10">
          {error?.message || capturesError?.message!}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} bg="$background" p="$4" space="$4">
      {/* Image Display */}
      <View alignItems="center">
      {/* <View> */}
        <Image
          source={{ uri: imageUrl, width: 500, height: 400 }} // Dimensions can be adjusted
          resizeMode="cover"
        />
        {/* Repositioned Close Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: 'absolute',
            top: 60, // Adjust for status bar
            right: 20,
            padding: 8,
            borderRadius: 99,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <X color="white" size={28} />
        </TouchableOpacity>
      </View>

      {/* Food Info Card */}
      <Card p="$4" bordered>
        <YStack space="$3">
          <H3>{food?.foodname}</H3>

          <XStack justify="space-between" ai="center">
            <YStack>
              <Text color="$color10">Rarity</Text>
              <Text fontWeight="700">{"🌙".repeat(food?.rarity!)}</Text>
            </YStack>

            <YStack>
              <Text color="$color10">Origin</Text>
              <Text>{food?.origin}</Text>
            </YStack>

            <YStack>
              <Text color="$color10">Captures</Text>
              <Text>{captures}</Text>
            </YStack>
          </XStack>

          <Paragraph color="$color10" mt="$2">
            {food?.description}
          </Paragraph>

          {/* <YStack mt="$3">
            <Text fontWeight="600" mb="$2">
              Friends who’ve had this
            </Text>
            <XStack space="$3">
              {[1, 2, 3, 4].map((_, i) => (
                <Avatar key={i} circular size="$4">
                  <Avatar.Image src={`https://i.pravatar.cc/100?img=${i + 1}`} />
                  <Avatar.Fallback backgroundColor="$color5" />
                </Avatar>
              ))}
            </XStack>
          </YStack> */}

          {parsedShowAdd ?
            <Button icon={Plus} mt="$3" onPress={() => createCapture()} disabled={uploadLoading}>
              {uploadLoading ? 'Adding...' : 'Add'}
            </Button> :
            <>
              {/* Only show favorite logic if this capture is already in the DB! */}
              <Button icon={() => favorite ? <Heart /> : <HeartPlus />} mt="$3" onPress={() => {
                if (!favorite) {
                  handleFavorite();
                } else {
                  handleDeleteFavorite();
                }
              }}>
                {favorite ? 'Favorited' : 'Not Favorited'}
              </Button>
              <Button icon={Trash} mt="$3" onPress={() => deleteCapture()} disabled={uploadLoading}>
                {uploadLoading ? 'Removing...' : 'Remove'}
              </Button>
            </>
          }
        </YStack>
      </Card>

      {/* Bottom Capture Bar */}
      {/* <Button
        icon={Camera}
        size="$6"
        bc="$blue10"
        color="white"
        position="absolute"
        bottom="$4"
        left="$4"
        right="$4"
      >
        Capture
      </Button> */}
    </YStack>
  )
}
