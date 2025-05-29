import { Box, ButtonText, ButtonIcon, Image, Heading, Button } from "@gluestack-ui/themed";
import React from "react"
import { useAppColorMode } from "../../components/ColorModeContext";
import { ExternalLink, SquarePen, GripVertical, Trash2 } from "lucide-react-native";
import { Alert, PermissionsAndroid, Platform, Share } from "react-native";
import moment from "moment";
import RNFS from "react-native-fs";
import { useAppColors } from "../../../hooks/useAppColors";

interface imagesProps {
    id: number,
    uri: string
}
interface ImageElementDetailsProps {
    onBack: () => void;
    listImage: imagesProps[]
}

const ImageElementDetailsComponetns: React.FC<ImageElementDetailsProps> = ({ onBack, listImage }) => {
    const colors = useAppColors();

    const image = "https://gluestack.github.io/public-blog-video-assets/Image%20Element.png"

    const shareImage = async () => {
        try {
            // 🔹 Kiểm tra quyền lưu ảnh trên Android
            if (Platform.OS === "android") {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền truy cập bộ nhớ.");
                    return;
                }
            }

            // 🔹 Tạo đường dẫn lưu ảnh tạm thời
            const fileName = `shared_image.jpg`;
            const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

            // 🔹 Tải ảnh về local
            const downloadResult = await RNFS.downloadFile({
                fromUrl: image,
                toFile: filePath
            }).promise;

            if (downloadResult.statusCode === 200) {
                // 🔹 Chia sẻ ảnh đã tải
                await Share.share({
                    url: `file://${filePath}`, // Dùng đường dẫn cục bộ
                    message: `Base React Native | Chia sẻ hình ảnh vào ${moment(new Date()).format("DD/MM/YYYY HH:mm")}`,
                });
            } else {
                throw new Error("Tải ảnh thất bại");
            }
        } catch (e) {
            console.log(e);
            Alert.alert("Lỗi", "Không thể chia sẻ ảnh.");
        }
    };

    return (
        <Box w="$full" h="$full" bgColor={colors.background.primary}>
            <Box
                w="$full"
                h="$16"
                bgColor={colors.background.primary}
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                px="$4"
            >
                <Button
                    variant="link"
                    onPress={onBack}
                    w={80}
                    paddingRight={20}
                >
                    <Heading size="sm" color={colors.text.primary}>Thoát</Heading>
                </Button>
            </Box>

            <Image
                source={{
                    uri: image,
                }}
                alt="image"
                h={"84%"}
                w={"$full"}
                resizeMode="contain"

            />
            <Box w="$full" flexDirection="row" justifyContent="space-between" px="$0">
                <Button
                    flex={1}
                    variant="link"
                    action="secondary"
                    size="sm"
                    onPress={() => shareImage()}
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
                    // onPress={() => setIsOpen(false)}

                    flexDirection="column"
                    alignItems="center"
                >
                    <ButtonIcon as={SquarePen} mb="$1" size="lg" color={colors.text.primary} />
                    <ButtonText color={colors.text.primary} size="xs">
                        Chỉnh sửa
                    </ButtonText>
                </Button>

                <Button
                    flex={1}
                    variant="link"
                    action="secondary"
                    size="sm"
                    // onPress={() => setIsOpen(false)}
                    flexDirection="column"
                    alignItems="center"
                >
                    <ButtonIcon as={Trash2} mb="$1" size="lg" color={colors.text.primary} />
                    <ButtonText color={colors.text.primary} size="xs">
                        Xoá
                    </ButtonText>
                </Button>

                <Button
                    flex={1}
                    variant="link"
                    action="secondary"
                    size="sm"
                    // onPress={() => setIsOpen(false)}
                    flexDirection="column"
                    alignItems="center"
                >
                    <ButtonIcon as={GripVertical} mb="$1" size="lg" color={colors.text.primary} />
                    <ButtonText color={colors.text.primary} size="xs">
                        Xem thêm
                    </ButtonText>
                </Button>
            </Box>
        </Box>
    );
}

export default ImageElementDetailsComponetns;