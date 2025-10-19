import { Star } from '@tamagui/lucide-icons';
import { useState } from 'react'
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, H6, H3,H4, Paragraph, Separator, useTheme, XGroup, XStack, YStack } from 'tamagui';
import { useUser, CURRENT_USER_ID } from 'hooks/useApi';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
    imageContainer: {
        width: 100, // Set desired width
        height: 100, // Set desired height, same as width for a perfect circle
        borderRadius: 0, // Half of width/height
        overflow: 'hidden', // Crucial for clipping
        borderWidth: 2, // Optional: add a border
        borderColor: 'blue', // Optional: border color
    },
    image: {
        width: '100%', // Image takes full width of container
        height: '100%', // Image takes full height of container
    },
});

const CircularImage = ({ imageUrl }) => {
    return (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="cover" // Ensures the image covers the entire circular area
            />
        </View>
    )
}

function DiscoveriesView (){
    return (
        <View flex={1} alignItems="left" justify="center" bg="$background">
            <H4>Discoveries</H4>
            <XStack>
            
            </XStack>
        </View>

    )
}

function ConstellationView (){
    return (
        <View flex={1} alignItems="left" justify="center" bg="$background">
            <H4>Constellations</H4>
            <XStack>

            </XStack>
        </View>

    )
}

export default function UserScreen() {
    const theme = useTheme()
    const points = 1000 //TODO: change later
    const imageURL = "";
    const { data } = useUser(CURRENT_USER_ID);
    const name = data?.result.user.username;
    const id = data?.result.user.id;
    const addFriendClick = () => {

    }
    // State to track the currently selected view
    const [selectedView, setSelectedView] = useState<"constellations" | "discoveries">("constellations");
    return (
        <SafeAreaProvider>
            <YStack flex={1} items="center" gap="$8" px="$10" pt="$8" bg="$background">

            <CircularImage imageUrl="sdf" />

            <YStack 
            items="center"
            justify="center"
            flexWrap="wrap"
            gap="$1"
            b="$3"
            >   
            <H3> {name} </H3>
            <Paragraph textAlign="center"> {id} </Paragraph>
            <XStack
            items="center"
            justify="center"
            flexWrap="wrap"
            gap="$1.5"
            b="$8"
            mt="$8" // Add margin-top to create spacing between name and XStack
            >
            <Star />
            <Paragraph
                fontSize="$5"
            >
                {points}
            </Paragraph>
            </XStack>
            <Button onPress={addFriendClick}>
            Add friend
            </Button>
            </YStack>
            <XGroup>
            <XGroup.Item>
            <Button onPress={() => setSelectedView("constellations")}>Constellations</Button>
            </XGroup.Item>
            <XGroup.Item>
            <Button onPress={() => setSelectedView("discoveries")}>Discoveries</Button>
            </XGroup.Item>
            </XGroup>
            {/* Conditionally render the selected view */}
            {selectedView === "constellations" ? (
            <ConstellationView />
            ) : (
            <DiscoveriesView />
            )}
            </YStack>
        </SafeAreaProvider>
    )
}
