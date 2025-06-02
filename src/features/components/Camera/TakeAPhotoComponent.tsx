import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Dimensions, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Loader from '../loader/LoadingComponent';
import { Camera, useCameraDevice, useCameraFormat, useCameraPermission } from 'react-native-vision-camera';
import { Circle } from 'lucide-react-native';
import { useAppColors } from '../../../hooks/useAppColors';
import PhotoControls from './components/PhotoControls';
import FlashControls from './components/FlashControls';
import Slider from '@react-native-community/slider';
import { Image } from '@gluestack-ui/themed';
import UUID from 'react-native-uuid';
import ImageMarker, { Position } from 'react-native-image-marker';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { TakeAPhotoProps, ImageData } from './types';
import { styles } from './style';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const TakeAPhotoComponent: React.FC<TakeAPhotoProps> = props => {
    const colors = useAppColors();
    const { isActive, onClose, config = {}, onPhotoTaken, onError } = props;
    const { hasPermission, requestPermission } = useCameraPermission();
    const [permissionGranted, setPermissionGranted] = useState(false);
    const zoomLevels = useMemo(() => {
        const min = config.minZoom || 1.0;
        const max = config.maxZoom || 2.0;
        return [min, (min + max) / 2, max];
    }, [config.minZoom, config.maxZoom]);
    const camera: any = useRef(null);
    const [showForcus, setShowForcus] = useState(false);
    const [focusPosition, setFocusPosition] = useState({ x: 0, y: 0 });
    const [isSliding, setIsSliding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photoHdr, setPhotoHdr] = useState(config.enableHDR || false);
    const [showListFlast, setShowListFlast] = useState(false);
    const [zoom, setZoom] = useState(config.defaultZoom || 1);
    const [flash, setFlash] = useState(1);
    const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>(config.enableFrontCamera ? 'back' : 'front');
    const [takePhotoOptionsCameraBack, setTakePhotoOptionsCameraBack] = useState({
        qualityPrioritization: config.photoQuality || 'speed',
        flash: 'auto',
    });
    const [takePhotoOptionsCameraFont, setTakePhotoOptionsCameraFont] = useState({
        qualityPrioritization: config.photoQuality || 'speed',
    });
    const [images, setImages] = useState<any[]>([]);
    const [exposure, setExposure] = useState(0);
    const [displayExposure, setDisplayExposure] = useState(0);
    const os = Platform.OS;
    const device: any = useCameraDevice(cameraPosition);
    const ultraWideDevice = useCameraDevice('back');

    useEffect(() => {
        const checkPermission = async () => {
            if (!hasPermission) {
                const granted = await requestPermission();
                setPermissionGranted(granted);
            } else {
                setPermissionGranted(true);
            }
        };
        checkPermission();
    }, [hasPermission, requestPermission]);


    let format: any = useCameraFormat(device, [
        { photoResolution: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } },
    ]);

    const takePhoto = useCallback(async () => {
        setLoading(true);
        try {
            if (camera.current == null) throw new Error('Camera Ref is Null');
            let photo = null;
            const optionsCamera =
                cameraPosition === 'back'
                    ? takePhotoOptionsCameraBack
                    : takePhotoOptionsCameraFont;

            photo = await camera.current.takePhoto(optionsCamera);
            let id = UUID.v4();
            const filename = `CheckList_${id}`;

            const watermarkText = config.watermarkText || "CheckList";
            const watermarkOptions = {
                backgroundImage: {
                    src: `file://${photo.path}`,
                    scale: 1,
                },
                watermarkTexts: [{
                    text: watermarkText,
                    positionOptions: {
                        position: config.watermarkPosition || Position.bottomLeft,
                    },
                    style: {
                        color: config.watermarkStyle?.color || '#ffff',
                        fontSize: config.watermarkStyle?.fontSize || 18,
                        fontName: config.watermarkStyle?.fontName || 'Arial',
                        bold: config.watermarkStyle?.bold || true,
                    },
                }],
                scale: 1,
                quality: 100,
                filename: filename,
            };

            let markedPhotoPath;
            try {
                markedPhotoPath = await ImageMarker.markText(watermarkOptions);
            } catch (error) {
                console.log('Lỗi khi đánh dấu ảnh:', error);
                markedPhotoPath = photo.path;
            }

            if (markedPhotoPath) {
                const imagePath =
                    Platform.OS === 'android'
                        ? `file://${markedPhotoPath}`
                        : `${markedPhotoPath}`;

                try {
                    await CameraRoll.save(imagePath, { type: 'photo' });
                    const photoData: ImageData = {
                        id: id,
                        url: imagePath,
                        node: "",
                    };
                    setImages(prevImages => [photoData, ...prevImages]);
                    onPhotoTaken?.(photoData);
                } catch (error) {
                    console.log('Lỗi khi lưu ảnh:', error);
                    onError?.(error);
                }
            }
        } catch (error) {
            console.log('Lỗi khi chụp, đánh dấu hoặc lưu ảnh:', error);
            onError?.(error);
        } finally {
            setLoading(false);
        }
    }, [
        takePhotoOptionsCameraFont,
        takePhotoOptionsCameraBack,
        cameraPosition,
        config,
        onPhotoTaken,
        onError,
    ]);

    const handleFocus = useCallback((event: any) => {
        setShowForcus(true);
        const { pageX, pageY } = event.nativeEvent;
        const c = camera.current;
        const x = Math.min(Math.max(pageX, 25), SCREEN_WIDTH - 25);
        const y = Math.min(Math.max(pageY, 25), SCREEN_HEIGHT - 25);

        if (c == null) return;
        c.focus({ x, y });

        setFocusPosition({ x, y });
    }, []);

    const toggleCamera = () => {
        if (cameraPosition === 'back') {
            setCameraPosition('front');
        } else {
            setCameraPosition('back');
        }
    };

    const renderCamera = useMemo(() => {
        if (!permissionGranted) {
            return (
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>Cần cấp quyền truy cập camera</Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
                        <Text style={styles.permissionButtonText}>Cấp quyền</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!device) {
            return (
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>Không tìm thấy thiết bị camera</Text>
                </View>
            );
        }

        return (
            <Camera
                ref={camera}
                device={device}
                isActive={isActive}
                style={os === 'android' ? { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } : StyleSheet.absoluteFill}
                enableZoomGesture={config.enableZoom !== false}
                zoom={zoom}
                photo={true}
                photoQualityBalance={config.photoQuality || 'balanced'}
                photoHdr={photoHdr}
                format={format}
                resizeMode={'cover'}
                videoBitRate={config.videoBitRate || 'normal'}
                exposure={config.enableExposure ? exposure : undefined}
            />
        );
    }, [camera, device, isActive, os, format, zoom, photoHdr, SCREEN_WIDTH, permissionGranted, requestPermission, exposure, config]);

    const onChangeFlash = (newFlash: any) => {
        setFlash(newFlash);
        const flashOptions: any = {
            1: { flash: 'auto' },
            2: { flash: 'on' },
            3: { flash: 'off' },
        };
        const updatedOptions = {
            qualityPrioritization: 'speed',
            ...flashOptions[newFlash],
        };
        setTakePhotoOptionsCameraBack(updatedOptions);
        setShowListFlast(!showListFlast);
    };

    const renderOptionTop = useMemo(() => {
        return (
            <View style={styles.viewTop}>
                {config.enableFlash !== false && (
                    <FlashControls
                        flash={flash}
                        showListFlast={showListFlast}
                        setShowListFlast={setShowListFlast}
                        onChangeFlash={onChangeFlash}
                    />
                )}
                {(!showListFlast) && (
                    <PhotoControls
                        photoHdr={photoHdr}
                        setPhotoHdr={setPhotoHdr}
                        toggleCamera={config.enableFrontCamera !== false ? toggleCamera : undefined}
                        onClose={onClose}
                        colors={colors}
                        hasUltraWide={!!ultraWideDevice && config.enableUltraWide !== false}
                        cameraPosition={cameraPosition}
                    />
                )}
            </View>
        );
    }, [photoHdr, showListFlast, flash, colors, ultraWideDevice, cameraPosition, config]);

    const renderOptionBottom = useCallback(() => {
        return (
            <>
                <View style={styles.viewBottom}>
                    <TouchableOpacity style={{ marginBottom: 30 }}>
                        {images.length > 0 ? (
                            <>
                                <Image source={{ uri: images[0].url }} style={{ width: 50, height: 50 }} borderRadius={6} alt="avatar" />
                            </>
                        ) : (
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    backgroundColor: '#00000070',
                                    borderRadius: 50,
                                }}
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => takePhoto()}>
                        <Circle size={100} color={colors.tailwind.white} />
                    </TouchableOpacity>

                    <View
                        style={{
                            width: 65,
                            height: 65,
                            backgroundColor: 'transparent',
                            borderRadius: 50,
                        }}
                    />

                </View>
            </>
        );
    }, [
        takePhotoOptionsCameraFont,
        takePhotoOptionsCameraBack,
        cameraPosition,
        images,
    ]);

    useEffect(() => {
        if (showForcus && !isSliding) {
            const timer = setTimeout(() => {
                setShowForcus(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showForcus, isSliding]);

    const renderOPtionZoom = () => {
        return (
            <>
                <View style={styles.zoomBar}>
                    {zoomLevels.map(level => (
                        <TouchableOpacity key={level} onPress={() => setZoom(level)}>
                            <Text
                                style={[
                                    styles.zoomText,
                                    {
                                        backgroundColor: zoom === level ? 'white' : '#00000070',
                                        color: zoom === level ? 'black' : 'white',
                                    },
                                ]}>
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </>
        );
    };

    const handleValueChange = useCallback((value: number) => {
        setDisplayExposure(value);
    }, []);

    const handleSlidingComplete = useCallback((value: number) => {
        setExposure(value);
        setIsSliding(false);
    }, []);

    return (
        <SafeAreaView style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'black' }}>
            <StatusBar
                translucent
                backgroundColor={colors.tailwind.black}
                barStyle="light-content"
            />
            <Pressable onPress={handleFocus} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {renderCamera}
                </View>
                {showForcus && focusPosition && (
                    <>
                        <View
                            style={{
                                position: 'absolute',
                                top: focusPosition.y - 20,
                                left: focusPosition.x - 25,
                                width: 80,
                                height: 80,
                                borderWidth: 3,
                                borderColor: 'white',
                                borderRadius: 40,
                            }}
                        />
                        <View style={{
                            position: 'absolute',
                            top: focusPosition.y - 10,
                            left: focusPosition.x + 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Slider
                                style={{
                                    width: 120,
                                    height: 40,
                                    transform: [{ rotate: '-90deg' }],
                                }}
                                minimumValue={-10}
                                maximumValue={10}
                                step={0.1}
                                value={exposure}
                                onValueChange={handleValueChange}
                                minimumTrackTintColor={colors.tailwind.white}
                                thumbTintColor={colors.tailwind.yellow[500]}
                                onSlidingStart={() => setIsSliding(true)}
                                onSlidingComplete={handleSlidingComplete}
                                maximumTrackTintColor={colors.tailwind.white}
                            />
                            <Text style={{ color: 'white', fontSize: 24, left: -40 }}>{displayExposure.toFixed(1)}</Text>
                        </View>
                    </>
                )}
            </Pressable>

            {permissionGranted && device && (
                <>
                    {renderOptionTop}
                    {renderOPtionZoom()}
                    {renderOptionBottom()}
                </>
            )}

            <Loader loading={loading} />
        </SafeAreaView>
    )

}

export default React.memo(TakeAPhotoComponent);
