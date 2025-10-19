import { Book, BookOpen, House } from '@tamagui/lucide-icons'
import { Tabs } from 'expo-router'
import { useTheme } from 'tamagui'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.accent10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: "",
          tabBarIcon: ({ color }) => <House color={color as any} />,
        }}
      />

      <Tabs.Screen
        name="logbook"
        options={{
          title: 'Logbook',
          headerTitle: "",
          tabBarIcon: ({ color, focused }) => focused ? <BookOpen color={color as any} /> : <Book color={color as any} />,
        }}
      />
    </Tabs>
  )
}
