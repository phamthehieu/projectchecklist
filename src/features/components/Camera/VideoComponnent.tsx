import { Box, HStack, VStack, Image, Modal, Icon } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import ButtonComponents from '../Button/ButtonComponents';
import { VideoIcon, Trash2, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppColors } from '../../../hooks/useAppColors';
import UUID from 'react-native-uuid';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ImageProps } from './CameraProps';
import MAlert from '../Alert/MAlert';
import VideoRecordingComponent from './VideoRecordingComponent';
import Video from 'react-native-video';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export interface VideoComponentProps {
    // Props cho container chính
    containerStyle?: ViewStyle;
    buttonStyle?: ViewStyle;
    buttonTextStyle?: TextStyle;
    buttonTitle?: string;
    showButton?: boolean;
    buttonIcon?: React.ReactNode;
    buttonIconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    // Props cho video list
    videoListStyle?: ViewStyle;
    videoItemStyle?: ViewStyle;
    videoThumbnailStyle?: ImageStyle;
    maxVideos?: number;
    onVideoListChange?: (videos: ImageProps[]) => void;

    // Props cho video recording
    videoRecordingProps?: Partial<React.ComponentProps<typeof VideoRecordingComponent>>;

    // Props cho video player
    videoPlayerStyle?: ViewStyle;
    videoPlayerControls?: boolean;
    videoPlayerRepeat?: boolean;

    // Props cho alert
    deleteAlertTitle?: string;
    deleteAlertMessage?: string;
    deleteAlertOkText?: string;
    deleteAlertCancelText?: string;

    // Callbacks
    onVideoAdd?: (video: ImageProps) => void;
    onVideoDelete?: (videoId: string) => void;
    onVideoSelect?: (video: ImageProps) => void;
}

const VideoComponnent: React.FC<VideoComponentProps> = ({
    // Container props
    containerStyle,
    buttonStyle,
    buttonTextStyle,
    buttonTitle,
    showButton = true,
    buttonIcon,
    buttonIconSize = "xl",

    // Video list props
    videoListStyle,
    videoItemStyle,
    videoThumbnailStyle,
    maxVideos,
    onVideoListChange,

    // Video recording props
    videoRecordingProps,

    // Video player props
    videoPlayerStyle,
    videoPlayerControls = true,
    videoPlayerRepeat = true,

    // Alert props
    deleteAlertTitle,
    deleteAlertMessage,
    deleteAlertOkText,
    deleteAlertCancelText,

    // Callbacks
    onVideoAdd,
    onVideoDelete,
    onVideoSelect,
}) => {
    const colors = useAppColors();
    const { t } = useTranslation();
    const [isCamera, setIsCamera] = useState(false);
    const [listVideo, setListVideo] = useState<ImageProps[]>([]);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<ImageProps | null>(null);
    const [showVideoModal, setShowVideoModal] = useState(false);

    const handleDeleteImage = (id: string) => {
        setSelectedVideoId(id);
        setShowDeleteAlert(true);
    };

    const confirmDelete = () => {
        if (selectedVideoId) {
            const newList = listVideo.filter(img => img.id !== selectedVideoId);
            setListVideo(newList);
            onVideoListChange?.(newList);
            onVideoDelete?.(selectedVideoId);
            setShowDeleteAlert(false);
            setSelectedVideoId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteAlert(false);
        setSelectedVideoId(null);
    };

    const handleVideoRecorded = (videoPath: string) => {
        const newVideo: ImageProps = {
            id: UUID.v4(),
            url: `file://${videoPath}`,
            node: ''
        };

        const updatedList = [...listVideo, newVideo];
        if (maxVideos && updatedList.length > maxVideos) {
            updatedList.shift(); // Xóa video cũ nhất nếu vượt quá giới hạn
        }

        setListVideo(updatedList);
        onVideoListChange?.(updatedList);
        onVideoAdd?.(newVideo);
    };

    const handleVideoSelect = (video: ImageProps) => {
        setSelectedVideo(video);
        setShowVideoModal(true);
        onVideoSelect?.(video);
    };

    return (
        <VStack style={containerStyle}>
            {showButton && (
                <ButtonComponents
                    marginTop={10}
                    type="save"
                    title={buttonTitle || t('video_recording')}
                    size="xl"
                    variant="solid"
                    action="primary"
                    onPress={() => setIsCamera(true)}
                    showIconLeft={true}
                    iconLeft={buttonIcon || VideoIcon}
                    iconLeftSize={buttonIconSize}
                    backgroundColor={typeof buttonStyle?.backgroundColor === 'string' ? buttonStyle.backgroundColor : undefined}
                    textColor={typeof buttonTextStyle?.color === 'string' ? buttonTextStyle.color : undefined}
                    borderColor={typeof buttonStyle?.borderColor === 'string' ? buttonStyle.borderColor : undefined}
                    borderWidth={typeof buttonStyle?.borderWidth === 'number' ? buttonStyle.borderWidth : undefined}
                    width={typeof buttonStyle?.width === 'number' ? buttonStyle.width : undefined}
                    height={typeof buttonStyle?.height === 'number' ? buttonStyle.height : undefined}
                    alignSelf={buttonStyle?.alignSelf}
                    justifyContent={buttonStyle?.justifyContent}
                    alignItems={buttonStyle?.alignItems}
                    opacity={typeof buttonStyle?.opacity === 'number' ? buttonStyle.opacity : undefined}
                    elevation={typeof buttonStyle?.elevation === 'number' ? buttonStyle.elevation : undefined}
                />
            )}

            <Box
                width="100%"
                minHeight={listVideo.length > 0 ? 160 : 30}
                borderWidth={1}
                borderColor={colors.tailwind.gray[500]}
                mt={16}
                borderRadius={10}
                style={videoListStyle}
            >
                <HStack space="sm" p={2}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space="sm" mr={12}>
                            {listVideo.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.videoItem, videoItemStyle]}
                                    onPress={() => handleVideoSelect(item)}
                                >
                                    <Image
                                        source={{ uri: item.url }}
                                        width={100}
                                        height={150}
                                        margin={5}
                                        borderRadius={10}
                                        alt={`Video thumbnail ${item.id}`}
                                        style={videoThumbnailStyle}
                                    />
                                    <VStack position="absolute" top={12} right={12} space="xs">
                                        <TouchableOpacity
                                            onPress={() => handleDeleteImage(item.id)}
                                            style={[styles.deleteButton, { backgroundColor: colors.tailwind.red[500] }]}
                                        >
                                            <Icon as={Trash2} size="xl" color={colors.tailwind.white} />
                                        </TouchableOpacity>
                                    </VStack>
                                </TouchableOpacity>
                            ))}
                        </HStack>
                    </ScrollView>
                </HStack>
            </Box>

            <MAlert
                visible={showDeleteAlert}
                title={deleteAlertTitle || t('delete_video')}
                message={deleteAlertMessage || t('are_you_sure_to_delete_video')}
                okText={deleteAlertOkText || t('delete')}
                cancelText={deleteAlertCancelText || t('cancel')}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                typeAlert="Delete"
            />

            <Modal
                isOpen={isCamera}
                onClose={() => setIsCamera(false)}
                style={styles.modal}
            >
                <VideoRecordingComponent
                    isActive={isCamera}
                    onClose={() => setIsCamera(false)}
                    onVideoRecorded={handleVideoRecorded}
                    {...videoRecordingProps}
                />
            </Modal>

            <Modal
                isOpen={showVideoModal}
                onClose={() => setShowVideoModal(false)}
                style={styles.modal}
            >
                <Box flex={1} bg="$black" justifyContent="center" alignItems="center">
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowVideoModal(false)}
                    >
                        <Icon as={X} size="xl" color="$white" />
                    </TouchableOpacity>
                    {selectedVideo && (
                        <Video
                            source={{ uri: selectedVideo.url }}
                            style={[styles.videoPlayer, videoPlayerStyle]}
                            resizeMode="contain"
                            repeat={videoPlayerRepeat}
                            controls={videoPlayerControls}
                        />
                    )}
                </Box>
            </Modal>
        </VStack>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        backgroundColor: 'black',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1000,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoPlayer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.8,
    },
    videoItem: {
        position: 'relative',
    },
    deleteButton: {
        padding: 5,
        borderRadius: 5,
    }
});

export default VideoComponnent;
