import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Dimensions, ModalProps, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import Loader from '../loader/LoadingComponent';
import { Camera, useCameraDevice, useCameraFormat, useCameraPermission } from 'react-native-vision-camera';
import { Circle, Mic, MicOff, Play, X } from 'lucide-react-native';
import { useAppColors } from '../../../hooks/useAppColors';
import PhotoControls from './components/PhotoControls';
import FlashControls from './components/FlashControls';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { styles } from './styles';
import * as Progress from 'react-native-progress';
import Video from 'react-native-video';

export interface VideoRecordingProps extends Partial<ModalProps> {
    isActive: boolean;
    onClose: () => void;
    onVideoRecorded?: (videoPath: string) => void;
    onPermissionDenied?: () => void;
    onError?: (error: any) => void;
    maxDuration?: number | null;
    initialCameraPosition?: 'back' | 'front';
    initialFlashMode?: number;
    initialMicEnabled?: boolean;
    initialHdrEnabled?: boolean;
    customStyles?: {
        container?: StyleSheet.NamedStyles<any>;
        controls?: StyleSheet.NamedStyles<any>;
        progress?: StyleSheet.NamedStyles<any>;
    };
    renderCustomControls?: {
        top?: () => React.ReactNode;
        bottom?: () => React.ReactNode;
    };
    videoCodec?: 'h264' | 'h265';
    videoBitRate?: 'low' | 'normal' | 'high';
    videoStabilizationMode?: 'off' | 'standard' | 'cinematic' | 'auto';
    enableZoomGesture?: boolean;
    saveToCameraRoll?: boolean;
    showPreview?: boolean;
    previewModalProps?: Partial<ModalProps>;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const VideoRecordingComponent: React.FC<VideoRecordingProps> = ({
    isActive,
    onClose,
    onVideoRecorded,
    onPermissionDenied,
    onError,
    maxDuration = 60,
    initialCameraPosition = 'back',
    initialFlashMode = 1,
    initialMicEnabled = false,
    initialHdrEnabled = false,
    customStyles,
    renderCustomControls,
    videoCodec = 'h265',
    videoBitRate = 'normal',
    videoStabilizationMode = 'auto',
    enableZoomGesture = true,
    saveToCameraRoll = true,
    showPreview = true,
    previewModalProps,
}) => {
    const colors = useAppColors();
    const os = Platform.OS;
    const timerRef = useRef<any>(null);
    const camera: any = useRef(null);
    const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isRecordingRef = useRef<boolean>(false);
    const ultraWideDevice = useCameraDevice('back');

    const [videoPath, setVideoPath] = useState('');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [photoHdr, setPhotoHdr] = useState(initialHdrEnabled);
    const [showListFlast, setShowListFlast] = useState(false);
    const [flash, setFlash] = useState(initialFlashMode);
    const [recordTime, setRecordTime] = useState(0);
    const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>(initialCameraPosition);
    const [isRecording, setIsRecording] = useState(false);
    const [mic, setMic] = useState(initialMicEnabled);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const videoRef = useRef(null);

    const device: any = useCameraDevice(cameraPosition);

    let format: any = useCameraFormat(device, [
        { videoResolution: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } },
    ]);

    const startRecording = useCallback(async () => {
        if (isRecordingRef.current) {
            try {
                setIsRecording(false);
                isRecordingRef.current = false;
                if (timerRef.current !== null) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                if (stopTimeoutRef.current !== null) {
                    clearTimeout(stopTimeoutRef.current);
                    stopTimeoutRef.current = null;
                }
                setRecordTime(0);
                await camera.current?.stopRecording();
            } catch (error) {
                onError?.(error);
            }
        } else {
            try {
                setIsRecording(true);
                isRecordingRef.current = true;
                timerRef.current = setInterval(() => {
                    setRecordTime(prevTime => prevTime + 1);
                }, 1000);

                if (maxDuration !== null) {
                    stopTimeoutRef.current = setTimeout(async () => {
                        if (camera.current && isRecordingRef.current) {
                            setIsRecording(false);
                            isRecordingRef.current = false;
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                            stopTimeoutRef.current = null;
                            setRecordTime(0);
                            await camera.current.stopRecording();
                        }
                    }, maxDuration * 1000);
                }

                await camera.current?.startRecording({
                    videoCodec,
                    onRecordingError: (error: any) => {
                        onError?.(error);
                        setIsRecording(false);
                        isRecordingRef.current = false;
                        if (timerRef.current !== null) {
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                        }
                        if (stopTimeoutRef.current !== null) {
                            clearTimeout(stopTimeoutRef.current);
                            stopTimeoutRef.current = null;
                        }
                    },
                    onRecordingFinished: (video: any) => {
                        setIsRecording(false);
                        isRecordingRef.current = false;
                        setVideoPath(video.path);
                        if (saveToCameraRoll) {
                            CameraRoll.save(`file://${video.path}`, { type: 'video' });
                        }
                        onVideoRecorded?.(video.path);
                        if (timerRef.current !== null) {
                            clearInterval(timerRef.current);
                            timerRef.current = null;
                        }
                        if (stopTimeoutRef.current !== null) {
                            clearTimeout(stopTimeoutRef.current);
                            stopTimeoutRef.current = null;
                        }
                        setRecordTime(0);
                    },
                });
            } catch (error) {
                onError?.(error);
                setIsRecording(false);
                isRecordingRef.current = false;
                if (timerRef.current !== null) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                if (stopTimeoutRef.current !== null) {
                    clearTimeout(stopTimeoutRef.current);
                    stopTimeoutRef.current = null;
                }
            }
        }
    }, [flash, maxDuration, onError, onVideoRecorded, saveToCameraRoll, videoCodec]);

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
                enableZoomGesture={enableZoomGesture}
                video={true}
                videoHdr={photoHdr}
                format={format}
                resizeMode={'cover'}
                videoBitRate={videoBitRate}
                videoStabilizationMode={videoStabilizationMode}
                audio={mic}
                torch={flash === 2 ? 'on' : 'off'}
            />
        );
    }, [camera, device, isActive, os, photoHdr, SCREEN_WIDTH, permissionGranted, requestPermission, mic, flash, enableZoomGesture, videoBitRate, videoStabilizationMode]);

    const onChangeFlash = (newFlash: any) => {
        setFlash(newFlash);
        setShowListFlast(!showListFlast);
    };

    const renderOptionTop = useMemo(() => {
        return (
            <>
                {!isRecording &&
                    <View style={[styles.viewTop, customStyles?.controls]}>
                        <FlashControls
                            type={"video"}
                            flash={flash}
                            showListFlast={showListFlast}
                            setShowListFlast={setShowListFlast}
                            onChangeFlash={onChangeFlash}
                        />

                        {(!showListFlast) && (
                            <PhotoControls
                                photoHdr={photoHdr}
                                setPhotoHdr={setPhotoHdr}
                                toggleCamera={toggleCamera}
                                onClose={onClose}
                                colors={colors}
                                hasUltraWide={!!ultraWideDevice}
                                cameraPosition={cameraPosition}
                            />
                        )}
                    </View>
                }
            </>
        );
    }, [photoHdr, showListFlast, flash, colors, ultraWideDevice, cameraPosition, isRecording, customStyles?.controls]);

    const renderVideoPreview = useMemo(() => {
        if (!videoPath || !showPreview) return null;

        return (
            <TouchableOpacity
                onPress={() => setShowPreviewModal(true)}
                style={styles.previewButton}
            >
                <Video
                    source={{ uri: `file://${videoPath}` }}
                    style={styles.previewThumbnail}
                    resizeMode="cover"
                    paused={true}
                />
                <View style={styles.previewOverlay}>
                    <Play size={24} color="white" />
                </View>
            </TouchableOpacity>
        );
    }, [videoPath, showPreview]);

    const renderPreviewModal = useMemo(() => {
        if (!showPreviewModal || !videoPath || !showPreview) return null;

        return (
            <Modal
                visible={showPreviewModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowPreviewModal(false)}
                {...previewModalProps}
            >
                <View style={styles.previewModalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowPreviewModal(false)}
                    >
                        <X size={24} color="white" />
                    </TouchableOpacity>
                    <Video
                        ref={videoRef}
                        source={{ uri: `file://${videoPath}` }}
                        style={styles.previewVideo}
                        resizeMode="contain"
                        repeat={true}
                        controls={true}
                    />
                </View>
            </Modal>
        );
    }, [showPreviewModal, videoPath, showPreview, previewModalProps]);

    const renderOptionBottom = useCallback(() => {
        return (
            <>
                <View style={[styles.viewBottom, customStyles?.controls]}>
                    {!isRecording ?
                        <TouchableOpacity
                            onPress={() => setMic(!mic)}
                            style={{
                                width: 70,
                                height: 70,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                borderRadius: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {mic ? (
                                <MicOff size={36} color={colors.tailwind.red[500]} />
                            ) : (
                                <Mic size={36} color={colors.tailwind.white} />
                            )}
                        </TouchableOpacity>
                        :
                        <View
                            style={{
                                width: 70,
                                height: 70,
                                backgroundColor: 'transparent',
                                borderRadius: 50,
                            }}
                        />
                    }

                    <TouchableOpacity onPress={() => startRecording()}>
                        {isRecording ? (
                            <>
                                {maxDuration !== null && (
                                    <Progress.Circle
                                        size={80}
                                        progress={recordTime / maxDuration}
                                        borderWidth={3}
                                        thickness={5}
                                        color={'#FA5252'}
                                        unfilledColor={'#FFFFFF20'}
                                        style={[customStyles?.progress, { marginBottom: 5 }]}
                                    />
                                )}
                            </>
                        ) : (
                            <Circle size={100} color={colors.tailwind.white} />
                        )}
                    </TouchableOpacity>

                    {!isRecording && videoPath != "" ?
                        renderVideoPreview
                        :
                        <View
                            style={{
                                width: 70,
                                height: 70,
                                backgroundColor: 'transparent',
                                borderRadius: 50,
                            }}
                        />
                    }
                </View>
            </>
        );
    }, [cameraPosition, mic, isRecording, recordTime, maxDuration, renderVideoPreview, customStyles?.controls, customStyles?.progress]);

    const renderRecordingTime = useMemo(() => {
        if (!isRecording) return null;

        return (
            <View style={styles.recordingTimeContainer}>
                <View style={styles.recordingIndicator} />
                <Text style={styles.recordingTimeText}>{formatTime(recordTime)}</Text>
            </View>
        );
    }, [isRecording, recordTime]);

    useEffect(() => {
        const checkPermission = async () => {
            if (!hasPermission) {
                const granted = await requestPermission();
                setPermissionGranted(granted);
                if (!granted) {
                    onPermissionDenied?.();
                }
            } else {
                setPermissionGranted(true);
            }
        };
        checkPermission();
    }, [hasPermission, requestPermission, onPermissionDenied]);

    return (
        <SafeAreaView style={[styles.container, customStyles?.container]}>
            {renderCamera}

            {permissionGranted && device && (
                <>
                    {renderRecordingTime}
                    {renderCustomControls?.top ? renderCustomControls.top() : renderOptionTop}
                    {renderCustomControls?.bottom ? renderCustomControls.bottom() : renderOptionBottom()}
                </>
            )}

            {renderPreviewModal}
            <Loader loading={loading} />
        </SafeAreaView>
    );
};

export default React.memo(VideoRecordingComponent);
