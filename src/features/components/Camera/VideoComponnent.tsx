import { Box, HStack, VStack, Image, Modal, Button, Icon } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import ButtonComponents from '../Button/ButtonComponents';
import { VideoIcon, Trash2, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppColors } from '../../../hooks/useAppColors';
import UUID from 'react-native-uuid';
import { StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ImageProps } from './CameraProps';
import MAlert from '../Alert/MAlert';
import VideoRecordingComponent from './VideoRecordingComponent';
import Video from 'react-native-video';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const VideoComponnent = () => {
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
            setListVideo(listVideo.filter(img => img.id !== selectedVideoId));
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
        setListVideo(prevVideos => [...prevVideos, newVideo]);
    };

    return (
        <VStack>
            <ButtonComponents
                marginTop={10}
                type="save"
                title={t('video_recording')}
                size="xl"
                variant="solid"
                action="primary"
                onPress={() => {
                    setIsCamera(true);
                }}
                showIconLeft={true}
                iconLeft={VideoIcon}
                iconLeftSize="xl"
            />

            <Box width="100%" minHeight={listVideo.length > 0 ? 160 : 30} borderWidth={1} borderColor={colors.tailwind.gray[500]} mt={16} borderRadius={10}>
                <HStack space="sm" p={2}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space="sm" mr={12}>
                            {listVideo.map((item) => (
                                <TouchableOpacity key={item.id} style={{ position: 'relative' }} onPress={() => {
                                    setSelectedVideo(item);
                                    setShowVideoModal(true);
                                }}>
                                    <Image
                                        source={{ uri: item.url }}
                                        width={100}
                                        height={150}
                                        margin={5}
                                        borderRadius={10}
                                        alt={`Video thumbnail ${item.id}`}
                                    />
                                    <VStack position="absolute" top={12} right={12} space="xs">
                                        <TouchableOpacity onPress={() => handleDeleteImage(item.id)} style={{ backgroundColor: colors.tailwind.red[500], padding: 5, borderRadius: 5 }}>
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
                title={t('delete_video')}
                message={t('are_you_sure_to_delete_video')}
                okText={t('delete')}
                cancelText={t('cancel')}
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
                    onClose={() => {
                        setIsCamera(false);
                    }}
                    onVideoRecorded={handleVideoRecorded}
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
                            style={styles.videoPlayer}
                            resizeMode="contain"
                            repeat={true}
                            controls={true}
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
    }
});

export default VideoComponnent;
