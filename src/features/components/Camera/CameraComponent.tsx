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


const CameraComponent = () => {
    const colors = useAppColors();
    const { t } = useTranslation();
    const [isCamera, setIsCamera] = useState(false);
    const [listImage, setListImage] = useState<ImageProps[]>([]);
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
            setListImage(prevImages =>
                prevImages.map(img =>
                    img.id === selectedImage.id
                        ? { ...img, node }
                        : img
                )
            );
        }
    };

    const confirmDelete = () => {
        if (selectedImageId) {
            setListImage(listImage.filter(img => img.id !== selectedImageId));
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
    };

    return (
        <VStack>
            <ButtonComponents
                marginTop={10}
                type="save"
                title={t('take_photo')}
                size="xl"
                variant="solid"
                action="primary"
                onPress={() => {
                    setIsCamera(true);
                }}
                showIconLeft={true}
                iconLeft={Camera}
                iconLeftSize="xl"
            />

            <Box width="100%" minHeight={160} borderWidth={1} borderColor={colors.tailwind.gray[500]} mt={16} borderRadius={10}>
                <HStack space="sm" p={2}>
                    <Box position="relative">
                        <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
                            <Image
                                alt="avatar"
                                source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
                                width={isCollapsed ? 20 : 100}
                                height={150}
                                margin={5}
                                borderRadius={10}
                            />
                        </TouchableOpacity>
                    </Box>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <HStack space="sm" mr={12} ml={12}>
                            {listImage.map((item) => (
                                <TouchableOpacity key={item.id} style={{ position: 'relative' }} onPress={() => setSelectedImage(item)}>
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
                    vido={0}
                    kinhdo={0}
                    profileUser={""}
                    vitri={''}
                    isActive={isCamera}
                    multiple={true}
                    onClose={() => {
                        setIsCamera(false);
                    }}
                    onPhotoTaken={(photoData) => {
                        setListImage(prevImages => [...prevImages, photoData]);
                    }}
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
                        setListImage(prevImages =>
                            prevImages.map(img =>
                                img.id === imageEdit.id ? imageEdit : img
                            )
                        );
                    }}
                />
            </Modal>

            <EditImage
                imageEdit={imageEdit}
                visible={imageEdit !== null}
                onBack={(imageEdit: ImageProps) => {
                    setListImage(prevImages =>
                        prevImages.map(img =>
                            img.id === imageEdit.id ? imageEdit : img
                        )
                    );
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
