import { Camera, X } from '@tamagui/lucide-icons';
import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { FoodRecognitionRequest, useRecognizeFood } from 'hooks/useApi';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Button, Image, Text, View, } from 'tamagui';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const camera = useRef<CameraView>(null);
    const [imageStats, setImageStats] = useState<CameraCapturedPicture | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [poiRequest, setPoiRequest] = useState<FoodRecognitionRequest | null>(null);
    const { data: pois, isLoading } = useRecognizeFood(poiRequest);
    const relativePOIs = useMemo(() => {
        console.log(imageStats?.height, imageStats?.width);
        return pois?.result.detections.map(detection => {
            if (detection.relabel == 1) return null;

            const [x1, y1, x2, y2] = detection.box_2d;
            return {
                x: x1,
                y: y1,
                width: x2 - x1,
                height: y2 - y1,
                label: detection.label,
            };
        });
    }, [pois]);

    useEffect(() => {
        if (pois) {
            console.log('POIs:', pois);
        }
    }, [pois]);

    if (!permission) {
        // Camera permissions are still loading.
        return <View background={"black"} />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission}>Grant permission</Button>
            </View>
        );
    }

    async function capture() {
        console.log('Capture photo');
        try {
            const photo = await camera.current?.takePictureAsync();
            setImageStats(photo!);
            setImage(photo!.uri);

            const blob = await (await fetch(photo!.uri)).blob();
            buildPOIRequest(blob);
        } catch (error) {
            console.error('Error capturing photo:', error);
        }
    }

    function blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = (reader.result as string).split(',')[1]; // remove prefix
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async function buildPOIRequest(image: Blob) {
        const b64image = await blobToBase64(image);
        const json = {
            mimetype: 'image/jpeg',
            image: b64image
        }
        setPoiRequest(json);
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }} >
            {image ? <Image source={{ uri: image }} style={{ flex: 1 }} /> : <CameraView style={{ flex: 1 }} ref={camera} />}

            {!!!image && <TouchableOpacity onPress={capture} style={{ position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: "white", padding: 16, borderRadius: "100%" }}>
                <Camera color="black" size={36} />
            </TouchableOpacity>}

            <TouchableOpacity onPress={() => router.back()}
                style={{ position: 'absolute', top: 20, right: 20, padding: 8, borderRadius: 8 }}>
                <X color="white" size={32} />
            </TouchableOpacity>

            {isLoading &&
                <View
                    style={{ position: 'absolute', top: "50%", left: "50%", transform: [{ translateX: -25 }, { translateY: -25 }], borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <ActivityIndicator size={50} />
                </View>
            }
        </View>
    );
}
