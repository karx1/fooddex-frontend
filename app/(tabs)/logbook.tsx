import { Text, View, useTheme } from 'tamagui'


export default function CapturesScreen() {
  const theme = useTheme()

  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <Text fontSize={20} color="$accent10">
        Profile
      </Text>
    </View>
  )
}