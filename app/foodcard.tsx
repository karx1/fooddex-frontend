import { Button, Card, H2, H3, Input, Paragraph, Stack, Text, XStack, YStack, Avatar, View, Image } from 'tamagui'
import { X, Menu, Camera, Plus } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import { BUCKET_PREFIX, CaptureCreate, CURRENT_USER_ID, useCreateCapture, useFoodByName, useFoodTotalCaptures } from 'hooks/useApi';
import { useEffect, useMemo, useState } from 'react';

export default function FoodPicScreen() {
  const params = useLocalSearchParams();
  const { foodname, image_id } = params;
  const {data: foodData, isLoading, error} = useFoodByName(foodname as string);
  const [uploadLoading, setUploadLoading] = useState(false);

  const food = useMemo(() => {
    if (!isLoading) {
      if (!foodData?.result.food) return null;
      console.log(foodData);
      return foodData.result.food;
    } else {
      return null;
    }
  }, [isLoading, foodData]);

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

  if (isLoading || isCapturesLoading) {
    return (
      <YStack flex={1} ai="center" jc="center" bg="$background">
          <Text mt="$2">Loading Logbook...</Text>
          <ActivityIndicator size="large" />
      </YStack>
    )
  }

  if (error || capturesError) {
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

          <Button icon={Plus} mt="$3" onPress={() => createCapture()} disabled={uploadLoading}>
            {uploadLoading ? 'Adding...' : 'Add'}
          </Button>
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
