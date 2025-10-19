import { Button, Card, H2, H3, Input, Paragraph, Stack, Text, XStack, YStack, Avatar } from 'tamagui'
import { X, Menu, Camera, Plus } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { TouchableOpacity } from 'react-native'

export default function FoodPicScreen() {
  const params = useLocalSearchParams();
  const { foodId } = params;


  return (
    <YStack flex={1} bg="$background" p="$4" space="$4">
      {/* Header */}
      <XStack ai="center" jc="space-between">
        <Menu size={24} />
        <H2>Food Pic</H2>
        <TouchableOpacity onPress={() => router.back()}
            style={{ position: 'absolute', top: 10, right: 10, padding: 8, borderRadius: 8 }}>
          <X color="white" size={32} />
        </TouchableOpacity>
      </XStack>

      {/* Food Info Card */}
      <Card p="$4" bordered>
        <YStack space="$3">
          <H3>{foodId}</H3>

          <XStack justify="space-between" ai="center">
            <YStack>
              <Text color="$color10">Rating</Text>
              <Text fontWeight="700">4 🌙</Text>
            </YStack>

            <YStack>
              <Text color="$color10">Origin</Text>
              <Text>America</Text>
            </YStack>

            <YStack>
              <Text color="$color10">Captures</Text>
              <Text>1.5 M</Text>
            </YStack>
          </XStack>

          <Paragraph color="$color10" mt="$2">
            AI description...
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

          <Button icon={Plus} mt="$3">
            Add
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
