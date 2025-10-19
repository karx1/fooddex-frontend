import '../tamagui-web.css'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { User } from '@tamagui/lucide-icons'
import { Provider } from 'components/Provider'
import { useFonts } from 'expo-font'
import { Href, SplashScreen, Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { Button, useTheme } from 'tamagui'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const router = useRouter();
  const theme = useTheme();


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: true,
            headerTitle: 'Foodex',
            headerTitleStyle: {
              color: theme.color.val,
            },
            headerStyle: {
              backgroundColor: theme.background.val,
            },
            headerRight:
              () => {
                return (
                  <Button
                    onPress={() => {
                      router.navigate('/user' as Href) // cursed but it works
                    }}
                    icon={User}
                  >
                  </Button>
                )
              }
          }}
        />
        <Stack.Screen
          name="user"
          options={{
            headerShown: false,
          }}
        />


        {/* Change this for the camera modal later */}
        <Stack.Screen name="capture" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="foodcard" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="constellationView" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="constellationAdd" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}
