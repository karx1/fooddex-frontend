import { Star } from '@tamagui/lucide-icons';
import { Image, StyleSheet, View } from 'react-native';
import { Button, H2, Paragraph, Separator, useTheme, XGroup, XStack, YStack } from 'tamagui';

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

const ConstellationView = ({ }) => {
    return (
        <YStack flex={1} items="center" gap="$8" px="$10" pt="$5" bg="$background">

        </YStack>

    )
}

export default function UserScreen() {
    const theme = useTheme()
    const points = 1000 //TODO: change later
    const imageURL = "";
    return (
        <YStack flex={1} items="center" gap="$8" px="$10" pt="$5" bg="$background">
            <H2>Tamagui + Expo</H2>

            <CircularImage imageUrl=imageURL />
            <XStack
                items="center"
                justify="center"
                flexWrap="wrap"
                gap="$1.5"
                position="absolute"
                b="$8"
            >
                <Star />
                <Paragraph
                    fontSize="$5"
                >
                    {points}
                </Paragraph>

            </XStack>
            <Separator />
            <XGroup>
                <XGroup.Item>
                    <Button>Constellations</Button>
                </XGroup.Item>
                <XGroup.Item>
                    <Button>Discoveries</Button>
                </XGroup.Item>
            </XGroup>


            {/* <XStack
                items="center"
                justify="center"
                flexWrap="wrap"
                gap="$1.5"
                position="absolute"
                b="$8"
            >
                <Paragraph fontSize="$5">Add</Paragraph>

                <Paragraph fontSize="$5" px="$2" py="$1" bg="$accentColor">
                    tamagui.config.ts
                </Paragraph>

                <Paragraph fontSize="$5">to root and follow the</Paragraph>

                <XStack
                    items="center"
                    gap="$1.5"
                    px="$2"
                    py="$1"
                    rounded="$3"
                    bg="$green5"
                    hoverStyle={{ bg: '$green6' }}
                    pressStyle={{ bg: '$green4' }}
                >
                    <Anchor
                        href="https://tamagui.dev/docs/core/configuration"
                        textDecorationLine="none"
                        color="$green10"
                        fontSize="$5"
                    >
                        Configuration guide
                    </Anchor>
                    <ExternalLink size="$1" color="$green10" />
                </XStack>

                <Paragraph fontSize="$5" text="center">
                    to configure your themes and tokens.
                </Paragraph>
            </XStack> */}
        </YStack>
    )
}
