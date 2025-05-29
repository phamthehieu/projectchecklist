import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
    ModalProps,
    Platform,
    StyleSheet,
    Dimensions,
    Pressable,
    View,
    Alert,
    Linking,
} from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCameraFormat,
    useCodeScanner,
    CameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera';
import {
    Box,
    Button,
    ButtonText,
    SafeAreaView,
    Text,
    Center,
    VStack,
    ButtonIcon,
} from '@gluestack-ui/themed';
import { styles } from './style';
import { CornerUpLeft, Flashlight, FlashlightOff, Images } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { scanFromPath } from 'react-native-qr-code-image-scan';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const squareSize = (SCREEN_WIDTH * 4) / 5;
const cornerSize = 30; // Độ dài đoạn viền ở góc
const cornerThickness = 4; // Độ dày viền


const QrCodeComponent = ({ navigation }: any) => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const [flash, setFlash] = useState(false);
    const camera = useRef(null);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            if (codes.length > 0) {
                console.log('QR Code detected:', codes[0].value);
                handleQrData(codes.map(code => code.value || ''));
            }
        },
    });

    const renderCamera = useCallback(() => {
        if (!device) {
            return (
                <Center flex={1}>
                    <VStack space="md" alignItems="center">
                        <Text color="$white">Không tìm thấy camera</Text>
                        <Button
                            variant="solid"
                            action="secondary"
                            onPress={() => navigation.goBack()}
                        >
                            <ButtonText>Thoát</ButtonText>
                        </Button>
                    </VStack>
                </Center>
            );
        }

        return (
            <Camera
                ref={camera}
                device={device}
                isActive={true}
                style={StyleSheet.absoluteFill}
                codeScanner={codeScanner}
                torch={flash ? 'on' : 'off'}
            />
        );
    }, [device, codeScanner, navigation, flash]);

    const viewQRCodeScreen = () => {
        if (!device) return null;

        return (
            <>

                <View style={{
                    position: 'absolute',
                    top: (SCREEN_HEIGHT - squareSize) / 2 - cornerThickness,
                    left: (SCREEN_WIDTH - squareSize) / 2 - cornerThickness,
                    width: cornerSize,
                    height: cornerThickness,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 8,
                    zIndex: 20,
                }} />
                <View style={{
                    position: 'absolute',
                    top: (SCREEN_HEIGHT - squareSize) / 2 - cornerThickness,
                    left: (SCREEN_WIDTH - squareSize) / 2 - cornerThickness,
                    width: cornerThickness,
                    height: cornerSize,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 8,
                    zIndex: 20,
                }} />

                <View style={{
                    position: 'absolute',
                    top: (SCREEN_HEIGHT - squareSize) / 2 - cornerThickness,
                    left: (SCREEN_WIDTH + squareSize) / 2 - cornerSize + cornerThickness,
                    width: cornerSize,
                    height: cornerThickness,
                    backgroundColor: 'white',
                    borderTopRightRadius: 8,
                    zIndex: 20,
                }} />
                <View style={{
                    position: 'absolute',
                    top: (SCREEN_HEIGHT - squareSize) / 2 - cornerThickness,
                    left: (SCREEN_WIDTH + squareSize) / 2,
                    width: cornerThickness,
                    height: cornerSize,
                    backgroundColor: 'white',
                    borderTopRightRadius: 8,
                    zIndex: 20,
                }} />

                <View style={{
                    position: 'absolute',
                    top: (SCREEN_HEIGHT + squareSize) / 2,
                    left: (SCREEN_WIDTH - squareSize) / 2 - cornerThickness,
                    width: cornerSize,
                    height: cornerThickness,
                    backgroundColor: 'white',
                    borderBottomLeftRadius: 8,
                    zIndex: 20,
                }} />

                <View style={{
                    position: 'absolute',
                    top: (SCREEN_HEIGHT + squareSize) / 2 - cornerSize + cornerThickness,
                    left: (SCREEN_WIDTH - squareSize) / 2 - cornerThickness,
                    width: cornerThickness,
                    height: cornerSize,
                    backgroundColor: 'white',
                    borderBottomLeftRadius: 8,
                    zIndex: 20,
                }} />

                <View style={{
                    position: 'absolute',
                    top: (SCREEN_HEIGHT + squareSize) / 2,
                    left: (SCREEN_WIDTH + squareSize) / 2 - cornerSize + cornerThickness,
                    width: cornerSize,
                    height: cornerThickness,
                    backgroundColor: 'white',
                    borderBottomRightRadius: 8,
                    zIndex: 20,
                }} />

                <View style={{
                    position: 'absolute',
                    top: (SCREEN_HEIGHT + squareSize) / 2 - cornerSize + cornerThickness,
                    left: (SCREEN_WIDTH + squareSize) / 2,
                    width: cornerThickness,
                    height: cornerSize,
                    backgroundColor: 'white',
                    borderBottomRightRadius: 8,
                    zIndex: 20,
                }} />

                <View
                    style={{
                        position: 'absolute',
                        bottom: (SCREEN_WIDTH - squareSize) / 2,
                        left: (SCREEN_HEIGHT - squareSize) / 2,
                        width: squareSize,
                        height: squareSize,
                        backgroundColor: 'transparent',
                    }}
                />
                <View style={[styles.headFootStyle, { bottom: 0 }]} />
                <View
                    style={[
                        styles.headFootStyle,
                        { bottom: (SCREEN_HEIGHT + squareSize) / 2 },
                    ]}
                />
                <View style={[styles.sideStyle, { left: 0 }]} />
                <View
                    style={[styles.sideStyle, { left: (SCREEN_WIDTH + squareSize) / 2 }]}
                />
            </>
        );
    };

    const handlePickImage = async () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,
            },
            async (response) => {
                if (response.assets && response.assets.length > 0) {
                    const imageUri: any = response.assets[0].uri;
                    console.log('Đã chọn ảnh:', imageUri);
                    const codes = await scanFromPath(imageUri);
                    console.log('data nhận được', codes);
                    handleQrData(codes);
                }
            }
        );
    };

    const handleQrData = (codes: string[]) => {
        if (!codes || codes.length === 0) {
            Alert.alert('Không có dữ liệu');
            return;
        }

        const data = codes[0]; // Lấy phần tử đầu tiên, hoặc xử lý theo nhu cầu

        // Regex kiểm tra URL
        const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;

        if (urlRegex.test(data)) {
            // Nếu là link, mở link
            Linking.openURL(data).catch(() => {
                Alert.alert('Không thể mở link này');
            });
        } else {
            // Nếu không phải link, hiện alert
            Alert.alert('Data', data);
        }
    };

    if (!hasPermission) {
        return (
            <SafeAreaView style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
                <Center flex={1}>
                    <VStack space="md" alignItems="center">
                        <Text color="$white">Cần quyền truy cập camera</Text>
                        <Button
                            variant="solid"
                            action="secondary"
                            onPress={requestPermission}
                        >
                            <ButtonText>Cấp quyền</ButtonText>
                        </Button>
                        <Button
                            variant="solid"
                            action="secondary"
                            onPress={() => navigation.goBack()}
                        >
                            <ButtonText>Thoát</ButtonText>
                        </Button>
                    </VStack>
                </Center>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
            <Pressable style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
                <Box flex={1} justifyContent="center" alignItems="center">
                    {renderCamera()}
                </Box>
            </Pressable>

            {viewQRCodeScreen()}

            <Box
                position="absolute"
                top={40}
                left={0}
                right={0}
                flexDirection="row"
                alignItems="center"
                px={20}
            >
                <Button
                    w={40}
                    h={40}
                    borderRadius="$full"
                    variant="outline"
                    action="secondary"
                    onPress={() => navigation.goBack()}
                >
                    <CornerUpLeft size={22} color="white" />
                </Button>

                <Text
                    flex={1}
                    textAlign="center"
                    color="$white"
                    fontSize="$lg"
                    fontWeight="$bold"
                >
                    Quét mã QR
                </Text>

                <Button
                    w={40}
                    h={40}
                    borderRadius="$full"
                    variant="outline"
                    action="secondary"
                    onPress={() => setFlash(!flash)}
                >
                    {flash ? (
                        <Flashlight size={22} color="white" />
                    ) : (
                        <FlashlightOff size={22} color="white" />
                    )}
                </Button>

            </Box>

            <Text bottom={SCREEN_HEIGHT / 4} color="$white" fontSize="$sm" fontWeight="$bold" textAlign="center">
                Di chuyển camera đến mã QR để quét hoặc
            </Text>

            <Button
                bottom={SCREEN_HEIGHT / 4}
                mt={30}
                variant="solid"
                action="secondary"
                onPress={handlePickImage}
                backgroundColor='transparent'
            >
                <ButtonIcon as={Images} mr={12} />
                <ButtonText>Chọn từ Thư viện ảnh</ButtonText>
            </Button>


        </SafeAreaView>
    );
};

export default QrCodeComponent;
