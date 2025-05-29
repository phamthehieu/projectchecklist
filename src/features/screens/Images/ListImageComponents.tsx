import React, { useEffect, useState, useCallback } from "react";
import { Box, Heading, Icon, Checkbox, CheckboxIndicator, CheckboxIcon, Button, Image, Menu, MenuItem, MenuItemLabel, ButtonIcon, ButtonText, } from "@gluestack-ui/themed";
import { Dimensions, FlatList, Alert, PermissionsAndroid, Platform, TouchableOpacity, Modal } from "react-native";
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useAppColorMode } from "../../components/ColorModeContext";
import { useFocusEffect } from "@react-navigation/native";
import { ImagePlus, CheckIcon, SquareLibrary, Camera } from "lucide-react-native";
import { ExternalLink, Trash2 } from "lucide-react-native";
import Share from 'react-native-share';
import ImageElementDetailsComponetns from "./ImageElementDetailsComponetns";
import { useAppColors } from "../../../hooks/useAppColors";

const { width } = Dimensions.get("window");
const itemMargin = 10;
const itemWidth = (width - itemMargin * 4) / 3;

const ListImageComponents: React.FC = ({ navigation }: any) => {
    const colors = useAppColors();
    const [images, setImages] = useState<Array<{ id: number, uri: string }>>([]);
    const [nextId, setNextId] = useState(1);

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [showCheckBox, setShowCheckBox] = useState(false);
    const [checkBoxAll, setCheckBoxAll] = useState(false);
    const [showModal, setShowModal] = useState(false)


    // 🔹 Reset state khi rời màn hình
    useFocusEffect(
        useCallback(() => {
            return () => {
                setShowCheckBox(false);
                setSelectedItems([]);
                setCheckBoxAll(false);
            };
        }, [])
    );

    // 🔹 Khi nhấn "Chọn tất cả" hoặc "Bỏ chọn tất cả"
    useEffect(() => {
        if (checkBoxAll) {
            setSelectedItems(images.map((item) => item.id)); // Chọn tất cả
        } else {
            setSelectedItems([]); // Bỏ chọn tất cả
        }
    }, [checkBoxAll, images]);

    const toggleCheckbox = (itemId: number) => {
        setSelectedItems((prev) =>
            prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]
        );
    };

    // Hàm kiểm tra và yêu cầu quyền truy cập (cho Android)
    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            if (Platform.Version >= 33) {
                // Android 13+ (API level 33)
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    {
                        title: "Yêu cầu quyền truy cập thư viện ảnh",
                        message: "Ứng dụng cần quyền truy cập vào thư viện ảnh của bạn",
                        buttonNeutral: "Hỏi lại sau",
                        buttonNegative: "Từ chối",
                        buttonPositive: "Đồng ý"
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                // Android 12 trở xuống
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: "Yêu cầu quyền truy cập bộ nhớ",
                        message: "Ứng dụng cần quyền truy cập vào bộ nhớ để chọn ảnh",
                        buttonNeutral: "Hỏi lại sau",
                        buttonNegative: "Từ chối",
                        buttonPositive: "Đồng ý"
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
        }
        return true; // iOS không cần yêu cầu quyền
    };

    // Hàm mở thư viện ảnh
    const openImageLibrary = async () => {
        const hasPermission = await requestPermissions();

        if (!hasPermission) {
            Alert.alert('Cần quyền truy cập', 'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.');
            return;
        }

        const options = {
            mediaType: 'photo' as const,
            selectionLimit: 0, // 0 for multiple selections
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
                Alert.alert('Lỗi', response.errorMessage || 'Đã xảy ra lỗi khi chọn ảnh');
            } else if (response.assets) {
                // Thêm ảnh đã chọn vào danh sách với ID duy nhất
                const newImages = response.assets.map((asset) => ({
                    id: nextId + Math.random(), // Tạo ID duy nhất
                    uri: asset.uri || '',
                }));

                setImages((prevImages) => [...prevImages, ...newImages]);
                setNextId(nextId + newImages.length);
            }
        });
    };

    // Hàm mở máy ảnh
    const openCamera = async () => {
        // Yêu cầu quyền camera cho Android
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Yêu cầu quyền truy cập máy ảnh",
                    message: "Ứng dụng cần quyền truy cập vào máy ảnh của bạn",
                    buttonNeutral: "Hỏi lại sau",
                    buttonNegative: "Từ chối",
                    buttonPositive: "Đồng ý"
                }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Cần quyền truy cập', 'Bạn cần cấp quyền truy cập máy ảnh để sử dụng tính năng này.');
                return;
            }
        }

        const options = {
            mediaType: 'photo' as 'photo',
            includeBase64: false,
            saveToPhotos: true,
        };

        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera picker');
            } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
                Alert.alert('Lỗi', response.errorMessage || 'Đã xảy ra lỗi khi chụp ảnh');
            } else if (response.assets && response.assets.length > 0) {
                const newImage = {
                    id: nextId,
                    uri: response.assets[0].uri || '',
                };

                setImages((prevImages) => [...prevImages, newImage]);
                setNextId(nextId + 1);
            }
        });
    };

    const renderItemImage = useCallback(({ item }: any) => {
        const isSelected = selectedItems.includes(item.id);
        return (
            <TouchableOpacity style={{ width: itemWidth, height: itemWidth, backgroundColor: colors.gray[600], margin: itemMargin / 2, borderRadius: 12 }}
                onLongPress={() => {
                    if (!showCheckBox) {
                        setShowCheckBox(true);
                        toggleCheckbox(item.id);
                    }
                }}
                onPress={() => {
                    if (showCheckBox) {
                        toggleCheckbox(item.id);
                    } else {
                        setShowModal(true)
                    }
                }}
            >
                {showCheckBox && (
                    <Checkbox
                        size="md"
                        isChecked={isSelected}
                        value={String(item.id)}
                        position="absolute"
                        top={5}
                        right={5}
                        zIndex={999}

                    >
                        <CheckboxIndicator bgColor={colors.white} borderColor={colors.gray[100]}>
                            <CheckboxIcon as={CheckIcon} color={colors.black} size="lg" />
                        </CheckboxIndicator>
                    </Checkbox>
                )}
                <Image
                    source={{ uri: item.uri }}
                    alt="Image"
                    style={{ width: '100%', height: '100%', borderRadius: 8 }}
                    resizeMode="cover"
                />
            </TouchableOpacity >
        );
    }, [showCheckBox, selectedItems, images]);

    const shareImages = async () => {
        if (selectedItems.length === 0) {
            Alert.alert("Thông báo", "Bạn chưa chọn ảnh để chia sẻ!");
            return;
        }

        // Lọc ra danh sách URI của các ảnh đã chọn
        const selectedUris = images
            .filter((img) => selectedItems.includes(img.id))
            .map((img) => img.uri);

        try {
            await Share.open({
                urls: selectedUris, // Chia sẻ nhiều ảnh
                failOnCancel: false,
            });
        } catch (error) {
            console.error("Lỗi chia sẻ ảnh: ", error);
        }
    };

    const deleteImages = () => {
        if (selectedItems.length === 0) {
            Alert.alert("Thông báo", "Bạn chưa chọn ảnh để xoá!");
            return;
        }

        Alert.alert(
            "Xác nhận xoá",
            `Bạn có chắc chắn muốn xoá ${selectedItems.length} ảnh không?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xoá",
                    style: "destructive",
                    onPress: () => {
                        setImages((prevImages) =>
                            prevImages.filter((img) => !selectedItems.includes(img.id))
                        );
                        setSelectedItems([]); // Reset lựa chọn sau khi xoá
                        setShowCheckBox(false);
                    },
                },
            ]
        );
    };


    return (
        <Box w="$full" h="$full" bgColor={colors.background.primary}>
            <Box
                w="$full"
                h="$16"
                bgColor={colors.background.secondary}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                px="$4"
            >
                {!showCheckBox ? (
                    <>
                        <Button
                            variant="link"
                            onPress={() => {
                                setShowCheckBox(false);
                                navigation.goBack();
                            }}
                            w={80}
                            paddingRight={20}
                        >
                            <Heading size="sm" color={colors.text.primary}>Thoát</Heading>
                        </Button>
                        <Heading size="sm" color={colors.text.primary}>Danh sách ảnh</Heading>

                        <Menu
                            placement="bottom right"
                            selectionMode="single"
                            closeOnSelect={true}
                            offset={2}
                            bgColor={colors.background.primary}
                            trigger={({ ...triggerProps }) => (
                                <Button
                                    variant="link"
                                    {...triggerProps}
                                    w={80}
                                    paddingLeft={20}
                                >
                                    <Icon as={ImagePlus} size="xl" color={colors.text.primary} />
                                </Button>
                            )}
                        >
                            <MenuItem
                                key="thuVien"
                                textValue="thuVien"
                                p="$2"
                                onPress={openImageLibrary}
                            >
                                <Icon as={SquareLibrary} size="sm" mr="$2" color={colors.text.primary} />
                                <MenuItemLabel size="sm" color={colors.text.primary}>Thư viện</MenuItemLabel>
                            </MenuItem>
                            <MenuItem
                                key="Camera"
                                textValue="Máy ảnh"
                                p="$2"
                                onPress={openCamera}
                            >
                                <Icon as={Camera} size="sm" mr="$2" color={colors.text.primary} />
                                <MenuItemLabel size="sm" color={colors.text.primary}>Máy ảnh</MenuItemLabel>
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <>
                        <Button
                            variant="link"
                            onPress={() => setCheckBoxAll(!checkBoxAll)}
                            w={100}
                        >
                            <Heading size="sm" color={colors.text.primary}>
                                {checkBoxAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                            </Heading>
                        </Button>
                        <Heading size="xs" color={colors.text.primary}>
                            {selectedItems.length > 0 ? `Đã chọn ${selectedItems.length}` : "Chọn mục"}
                        </Heading>
                        <Button
                            variant="link"
                            onPress={() => {
                                setShowCheckBox(false);
                                setSelectedItems([]);
                                setCheckBoxAll(false);
                            }}
                            w={100}
                            paddingLeft={20}
                        >
                            <Heading size="sm" color={colors.text.primary}>Huỷ</Heading>
                        </Button>
                    </>
                )}
            </Box>

            <FlatList
                data={images}
                numColumns={3}
                contentContainerStyle={{ padding: 5 }}
                renderItem={(item: any) => renderItemImage(item)}
                keyExtractor={(item) => item.id.toString()}
                removeClippedSubviews={false}
                ListEmptyComponent={() => (
                    <Box w="100%" alignItems="center" justifyContent="center" p="$5">
                        <Heading size="sm" color={colors.text.primary}>Không có ảnh nào. Nhấn vào biểu tượng {<Icon as={ImagePlus} size="xs" color={colors.text.primary} />} để thêm ảnh.</Heading>
                    </Box>
                )}
            />
            {showCheckBox &&
                <Box w="$full" flexDirection="row" justifyContent="space-between" px="$0" marginBottom={16}>
                    <Button
                        flex={1}
                        variant="link"
                        action="secondary"
                        size="sm"
                        onPress={() => shareImages()}
                        flexDirection="column"
                        alignItems="center"
                    >
                        <ButtonIcon as={ExternalLink} mb="$1" size="lg" color={colors.text.primary} />
                        <ButtonText color={colors.text.primary} size="xs">
                            Chia sẻ
                        </ButtonText>
                    </Button>

                    <Button
                        flex={1}
                        variant="link"
                        action="secondary"
                        size="sm"
                        onPress={() => deleteImages()}
                        flexDirection="column"
                        alignItems="center"
                    >
                        <ButtonIcon as={Trash2} mb="$1" size="lg" color={colors.text.primary} />
                        <ButtonText color={colors.text.primary} size="xs">
                            Xoá
                        </ButtonText>
                    </Button>

                </Box>
            }
            <Modal visible={showModal} animationType="slide" style={{ width: "100%", height: "100%" }}>
                <ImageElementDetailsComponetns
                    onBack={() => setShowModal(false)}
                    listImage={images}
                />
            </Modal>
        </Box>
    );
};

export default ListImageComponents; 