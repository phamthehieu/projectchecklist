import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useAppColors } from "../../../../hooks/useAppColors";
import { useTranslation } from "react-i18next";

interface footerComponentProps {
    option: number;
    setOption: (value: number) => void;
    setDrawings: () => void;
    captureImage: () => void;
    onCancel: () => void;
    onBack: () => void;
}

const HeaderEditImageComponent = ({ option, setOption, setDrawings, captureImage, onCancel, onBack }: footerComponentProps) => {
    const colors = useAppColors();
    const { t } = useTranslation();
    return (
        <View style={styles.headerContainer}>
            {option != 0 ?
                <TouchableOpacity
                    onPress={onCancel}
                    style={[styles.backButton, { marginLeft: 6 }]}>
                    <Text style={[styles.backButtonText, { color: colors.text.primary }]}>{t('cancel')}</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                    onPress={onBack}
                    style={[styles.backButton, { marginLeft: 6 }]}>
                    <Text style={[styles.backButtonText, { color: colors.text.primary }]}>{t('exit')}</Text>
                </TouchableOpacity>
            }
            {option != 0 &&
                <TouchableOpacity
                    onPress={captureImage}
                    style={[styles.backButton, { marginRight: 6, width: 100 }]}>
                    <Text style={[styles.backButtonText, { color: colors.tailwind.yellow[500] }]}>{t('complete')}</Text>
                </TouchableOpacity>
            }

        </View>
    )
}


const styles = StyleSheet.create({
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 16
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
});

export default HeaderEditImageComponent