import { Box, HStack, VStack, Image, Modal, Button, Icon } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import ButtonComponents from '../Button/ButtonComponents';
import { Camera, Trash2, Edit } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppColors } from '../../../hooks/useAppColors';
import TakeAPhotoComponent from './TakeAPhotoComponent';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ImageProps } from './CameraProps';
import MAlert from '../Alert/MAlert';
import ImageDetailComponent from '../images/ImageDetailComponent';
import EditImage from '../images/EditImageComponent';
import { Position } from 'react-native-image-marker';
import { ImageData } from './types';

export interface CameraComponentProps {
    config?: typeof defaultConfig;
    onImagesChange?: (images: ImageProps[]) => void;
    onImageSelect?: (image: ImageProps) => void;
    onImageEdit?: (image: ImageProps) => void;
    onImageDelete?: (imageId: string) => void;

    // Tùy chỉnh UI
    buttonTitle?: string;
    showButton?: boolean;
    containerStyle?: any;
    imageContainerStyle?: any;
    maxImages?: number;

    // Giá trị ban đầu
    initialImages?: ImageProps[];
    showImageTamplate?: boolean;
    imageTamplate?: string;
}

const defaultConfig = {
    // Camera settings
    minZoom: 1.0,
    maxZoom: 3.0,
    defaultZoom: 1.0,
    enableHDR: true,
    enableFlash: true,
    enableFrontCamera: true,
    photoQuality: 'balanced' as const,
    enableZoom: true,
    videoBitRate: 'normal' as const,
    enableExposure: true,
    enableUltraWide: true,

    // Watermark settings
    watermarkText: 'My App',
    watermarkPosition: Position.bottomRight,
    watermarkStyle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontName: 'Arial',
        bold: true
    },

    // Additional features
    multiple: true,
    profileUser: null,

    // Custom controls
    customControls: {
        showZoomControl: true,
        showFlashControl: true,
        showHDRControl: true,
        showExposureControl: true,
        showCameraFlip: true
    },

    // Custom styles
    customStyles: {
        container: {
            backgroundColor: 'black'
        },
        controls: {
            backgroundColor: 'rgba(0,0,0,0.5)'
        },
        button: {
            backgroundColor: '#007AFF'
        },
        watermark: {
            opacity: 0.8
        }
    },

    validateImage: async (image: ImageData) => {
        return true;
    }
};

const CameraComponent: React.FC<CameraComponentProps> = ({
    config = defaultConfig,
    onImagesChange,
    onImageSelect,
    onImageEdit,
    onImageDelete,
    buttonTitle,
    showButton = true,
    containerStyle,
    imageContainerStyle,
    maxImages,
    initialImages = [],
    showImageTamplate = true,
    imageTamplate = 'https://randomuser.me/api/portraits/men/1.jpg'
}) => {
    const colors = useAppColors();
    const { t } = useTranslation();
    const [isCamera, setIsCamera] = useState(false);
    const [listImage, setListImage] = useState<ImageProps[]>(initialImages);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<ImageProps | null>(null);
    const [imageEdit, setImageEdit] = useState<ImageProps | null>(null);

    const handleDeleteImage = (id: string) => {
        setSelectedImageId(id);
        setShowDeleteAlert(true);
    };

    const handleNodeChange = (node: string) => {
        if (selectedImage) {
            const updatedImages = listImage.map(img =>
                img.id === selectedImage.id ? { ...img, node } : img
            );
            setListImage(updatedImages);
            onImagesChange?.(updatedImages);
        }
    };

    const confirmDelete = () => {
        if (selectedImageId) {
            const updatedImages = listImage.filter(img => img.id !== selectedImageId);
            setListImage(updatedImages);
            onImagesChange?.(updatedImages);
            onImageDelete?.(selectedImageId);
            setShowDeleteAlert(false);
            setSelectedImageId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteAlert(false);
        setSelectedImageId(null);
    };

    const handleEditImage = (data: ImageProps) => {
        setImageEdit(data);
        onImageEdit?.(data);
    };

    const handleImageSelect = (image: ImageProps) => {
        setSelectedImage(image);
        onImageSelect?.(image);
    };

    const handlePhotoTaken = (photoData: ImageProps) => {
        if (maxImages && listImage.length >= maxImages) {
            return;
        }
        const updatedImages = [...listImage, photoData];
        setListImage(updatedImages);
        onImagesChange?.(updatedImages);
    };

    return (
        <VStack style={containerStyle}>
            {showButton && (
                <ButtonComponents
                    marginTop={10}
                    type="save"
                    title={buttonTitle || t('take_photo')}
                    size="xl"
                    variant="solid"
                    action="primary"
                    onPress={() => setIsCamera(true)}
                    showIconLeft={true}
                    iconLeft={Camera}
                    iconLeftSize="xl"
                />
            )}

            <Box width="100%" minHeight={160} borderWidth={1} borderColor={colors.tailwind.gray[500]} mt={16} borderRadius={10} style={imageContainerStyle}>
                <HStack space="sm" p={2}>
                    {showImageTamplate &&
                        <Box position="relative">
                            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                                <Image
                                    alt="avatar"
                                    source={{ uri: imageTamplate }}
                                    width={isCollapsed ? 20 : 100}
                                    height={150}
                                    margin={5}
                                    borderRadius={10}
                                />
                            </TouchableOpacity>
                        </Box>
                    }
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space="sm" mr={12} ml={12}>
                            {listImage.map((item) => (
                                <TouchableOpacity key={item.id} style={{ position: 'relative' }} onPress={() => handleImageSelect(item)}>
                                    <Image source={{ uri: item.url }} width={100} height={150} margin={5} borderRadius={10} alt="avatar" />
                                    <VStack position="absolute" top={12} right={12} space="xs">
                                        <TouchableOpacity onPress={() => handleDeleteImage(item.id)} style={{ backgroundColor: colors.tailwind.red[500], padding: 5, borderRadius: 5 }}>
                                            <Icon as={Trash2} size="xl" color={colors.tailwind.white} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleEditImage(item)} style={{ backgroundColor: colors.tailwind.blue[500], padding: 5, borderRadius: 5, marginTop: 5 }}>
                                            <Icon as={Edit} size="xl" color={colors.tailwind.white} />
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
                title={t('delete_image')}
                message={t('are_you_sure_to_delete_image')}
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
                <TakeAPhotoComponent
                    config={config}
                    isActive={isCamera}
                    onClose={() => setIsCamera(false)}
                    onPhotoTaken={handlePhotoTaken}
                />
            </Modal>

            <Modal
                isOpen={selectedImage !== null}
                onClose={() => setSelectedImage(null)}
            >
                <ImageDetailComponent
                    onBack={() => setSelectedImage(null)}
                    image={selectedImage!}
                    templateText={''}
                    onNodeChange={handleNodeChange}
                    onEditImage={(imageEdit: ImageProps) => {
                        const updatedImages = listImage.map(img =>
                            img.id === imageEdit.id ? imageEdit : img
                        );
                        setListImage(updatedImages);
                        onImagesChange?.(updatedImages);
                    }}
                />
            </Modal>

            <EditImage
                imageEdit={imageEdit}
                visible={imageEdit !== null}
                onBack={(imageEdit: ImageProps) => {
                    const updatedImages = listImage.map(img =>
                        img.id === imageEdit.id ? imageEdit : img
                    );
                    setListImage(updatedImages);
                    onImagesChange?.(updatedImages);
                    setImageEdit(null);
                }}
            />
        </VStack>
    );
};

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        margin: 0,
        backgroundColor: 'black',
    }
});

export default CameraComponent;
