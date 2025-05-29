import React, { useState } from "react";
import { Box, Icon, ScrollView, SafeAreaView, VStack } from "@gluestack-ui/themed";
import { ImageProps } from "../Camera/CameraProps";
import { useTranslation } from "react-i18next";
import { SCREEN_WIDTH, SCREEN_HEIGHT, useAppColors } from "../../../hooks/useAppColors";
import MHeader from "../header/MHeader";
import { Platform, StatusBar, StyleSheet, Image } from "react-native";
import TextareaComponent from "../Textarea/TextareaComponents";
import { Edit } from "lucide-react-native";
import EditImage from "./EditImageComponent";

interface ImageElementDetailsProps {
    onBack: () => void;
    image: ImageProps;
    templateText: string;
    onNodeChange?: (node: string) => void;
    onEditImage?: (imageEdit: ImageProps) => void;
}

const ImageDetailComponent: React.FC<ImageElementDetailsProps> = ({ onBack, image, templateText, onNodeChange, onEditImage }) => {
    const colors = useAppColors();
    const { t } = useTranslation();
    const [node, setNode] = useState(image.node);
    const [imageEdit, setImageEdit] = useState<ImageProps | null>(null);

    const handleNodeChange = (text: string) => {
        if (text.length < templateText.length) {
            return;
        }
        setNode(text);
        onNodeChange?.(text);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <MHeader label={t('detail_image')} showiconLeft onBack={() => { onBack() }} showIconRight={true} iconRight={<Icon as={Edit} size="lg" color={colors.text.primary} />} onPressIconRight={() => { setImageEdit(image) }} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <VStack space="xl">
                    <Box>
                        <Image
                            alt="avatar"
                            source={{ uri: image.url }}
                            style={{
                                width: SCREEN_WIDTH,
                                height: SCREEN_HEIGHT / 1.3,
                                marginHorizontal: 0,
                                alignSelf: 'center',
                            }}
                            resizeMode="contain"
                        />
                    </Box>
                    <TextareaComponent
                        label={t('note')}
                        placeholder={t('note')}
                        value={node}
                        onChangeText={handleNodeChange}
                        template={templateText}
                        onValidationError={(errors) => {
                            console.log('Validation errors:', errors);
                        }}
                        textareaInputProps={{
                            style: {
                                fontSize: 16,
                                lineHeight: 24,
                            }
                        }}
                    />
                </VStack>
            </ScrollView>
            <EditImage
                imageEdit={imageEdit}
                visible={imageEdit !== null}
                onBack={(imageEdit: ImageProps) => {
                    onEditImage?.(imageEdit);
                    setImageEdit(null);
                }}
            />
        </SafeAreaView>
    )
}

export default ImageDetailComponent;


const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 10,
        flexGrow: 1,
        paddingBottom: 50,
    },
});