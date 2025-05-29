import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, ButtonText, ButtonIcon, ScrollView } from "@gluestack-ui/themed";
import { PaintBucket, Pencil, Eraser, Image, Scissors, Paintbrush, Smile, Type } from "lucide-react-native";
import { useAppColors } from "../../../../hooks/useAppColors";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;

interface footerComponentProps {
    option: number;
    setColorChart: (value: boolean) => void;
    colorChart: boolean;
    isErasing: boolean
    colorDraw: string;
    setIsErasing: (value: boolean) => void;
    setOption: (value: number) => void;
    setDrawings: () => void;
    openImageCropper: () => void;
    setShowIcon: (value: boolean) => void;
    showIcon: boolean;
    colorIcon: string
}

const FooterComponent = ({ option, setColorChart, colorChart, isErasing, colorDraw, setIsErasing, setOption, setDrawings, openImageCropper, showIcon, setShowIcon, colorIcon }: footerComponentProps) => {
    const colors = useAppColors();
    const { t } = useTranslation();
    return (
        <View style={[styles.footerContainer, { backgroundColor: colors.background.primary }]}>
            {option == 1 &&
                <>
                    <Button
                        onPress={() => setColorChart(!colorChart)}
                        variant="outline"
                        size="sm"
                    >
                        <ButtonIcon as={PaintBucket} color={colorDraw} mr={6} />
                        <ButtonText color={colors.text.primary}>{t('color')}</ButtonText>
                    </Button>
                    <Button
                        onPress={() => setIsErasing(false)}
                        variant={isErasing ? "outline" : "solid"}
                        size="sm"
                    >
                        <ButtonIcon as={Pencil} color={isErasing ? colors.text.primary : colors.background.primary} mr={6} />
                        <ButtonText color={isErasing ? colors.text.primary : colors.background.primary}>{t('draw')}</ButtonText>
                    </Button>

                    <Button
                        onPress={() => setIsErasing(true)}
                        variant={isErasing ? "solid" : "outline"}
                        size="sm"
                    >
                        <ButtonIcon as={Eraser} color={isErasing ? colors.background.primary : colors.text.primary} mr={6} />
                        <ButtonText color={isErasing ? colors.background.primary : colors.text.primary}>{t('erase')}</ButtonText>
                    </Button>

                </>
            }

            {option == 2 &&
                <>
                    <Button
                        onPress={() => {
                            const newShowIcon = !showIcon;
                            setShowIcon(newShowIcon);
                            setColorChart(false)
                        }}
                        variant="outline"
                        size="sm"
                    >
                        <ButtonIcon as={Image} color={colors.text.primary} mr={6} />
                        <ButtonText color={colors.text.primary}>{t('draw')}</ButtonText>
                    </Button>

                    <Button
                        onPress={() => {
                            const newColorChart = !colorChart;
                            setColorChart(newColorChart);
                            setShowIcon(false)
                        }}
                        variant="outline"
                        size="sm"
                    >
                        <ButtonIcon as={PaintBucket} color={colorIcon} mr={6} />
                        <ButtonText color={colors.text.primary}>{t('color')}</ButtonText>
                    </Button>
                </>
            }

            {option == 0 &&
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Button
                        margin={12}
                        onPress={() => openImageCropper()}
                        variant="outline"
                        size="sm"
                    >
                        <ButtonIcon as={Scissors} color={colors.text.primary} mr={6} />
                        <ButtonText color={colors.text.primary}>{t('cut_image')}</ButtonText>
                    </Button>
                    <Button
                        margin={12}
                        onPress={() => {
                            setOption(1)
                            setDrawings()
                        }}
                        variant="outline"
                        size="sm"
                    >
                        <ButtonIcon as={Paintbrush} color={colors.text.primary} mr={6} />
                        <ButtonText color={colors.text.primary}>{t('draw_hand')}</ButtonText>
                    </Button>
                    <Button
                        margin={12}
                        onPress={() => {
                            setOption(2)
                            setShowIcon(true);
                        }}
                        variant="outline"
                        size="sm"
                    >
                        <ButtonIcon as={Smile} color={colors.text.primary} mr={6} />
                        <ButtonText color={colors.text.primary}>{t('sticker')}</ButtonText>
                    </Button>
                    {/* <Button
                        margin={12}
                        onPress={() => {
                            setOption(3)
                        }}
                        variant="outline"
                        size="sm"
                    >
                        <ButtonIcon as={Type} color={colors.text.primary} mr={6} />
                        <ButtonText color={colors.text.primary}>{t('text')}</ButtonText>
                    </Button> */}
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    footerContainer: {
        marginTop: 12,
        width: screenWidth,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default FooterComponent