import { Star, X } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import type { Constellation } from 'hooks/useApi';
import { CURRENT_USER_ID, useConstellations, useUser } from 'hooks/useApi';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Avatar, Button, H3, H4, Paragraph, useTheme, XGroup, XStack, YStack } from 'tamagui';

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

const CircularImage = ({ imageUrl, size = 150 }) => {
    const styles = StyleSheet.create({
        // The imageContainer ensures the border is on the circle itself
        imageContainer: {
            width: size,
            height: size,
            borderRadius: size / 2, // Half the size makes it a perfect circle
            overflow: 'hidden',     // Crucial: Clips the content (Image) to the border radius
            // Optional: border for visibility/effect
            borderWidth: 1,
            borderColor: '#ddd',
        },
        image: {
            width: '100%', // Take up the full width of the container
            height: '100%', // Take up the full height of the container
        },
    });

    return (
        <Avatar circular size="$8">
            <Avatar.Image src="http://picsum.photos/200/300" />
            <Avatar.Fallback bc="red" />
        </Avatar>
    )
}

function DiscoveriesView() {
    return (
        <View flex={1} alignItems="left" justify="center" bg="$background">
            <H4>Discoveries</H4>
            <XStack>

            </XStack>
        </View>

    )
}

function ConstellationView(props) {
    const constellations: Constellation[] = props.constellations
    return (
        <View flex={1} alignItems="left" justify="center" bg="$background">
            <H4>Constellations</H4>
            <XStack>
                {constellations.map(item => (
                    <Paragraph key={item.id}>{item.name}</Paragraph>
                ))}
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
    const { data: constellationData, isLoading } = useConstellations();
    const goToUserIndex = () => {
        // You should use router.back() to logically "return"
        // If you specifically want to go to /home, use router.replace('/(tabs)/home')
        router.back();
    }
    // State to track the currently selected view
    const [selectedView, setSelectedView] = useState<"constellations" | "discoveries">("constellations");
    return (
        <YStack flex={1} items="center" gap="$8" px="$10" pt="$14" bg="$background">
            <Button
                size="$3" // Small button size
                chromeless // Remove background and border for a clean icon look
                icon={<X size="$1" />} // Use the X icon
                onPress={() => router.back()} // Use router.back() to go to the previous screen
                position="absolute" // Position independently of the flow
                top="$8" // Distance from the top
                right="$4" // Distance from the right
                zIndex={10} // Ensure it's above other elements
                circular // Make the button circular
            />
            <Avatar circular size="$10">
                <Avatar.Image src="https://pub-495a1a79b2634ef3ae2ea1e867730068.r2.dev/33dd913e-f522-4119-8665-69113412243f" />

            </Avatar>
            <YStack
                items="center"
                justify="center"
                flexWrap="wrap"
                gap="$1"
                b="$3"
            >
                <H3> {name} </H3>
                {/* <Paragraph textAlign="center"> {id} </Paragraph> */}
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
            {selectedView === "constellations" ? (
                isLoading ? (
                    <ActivityIndicator size="large" color={theme.color.get()} />
                ) : (
                    <ConstellationView constellations={constellationData?.result.constellations} />
                )
            ) : (
                <DiscoveriesView />
            )}
        </YStack>
    )
}
