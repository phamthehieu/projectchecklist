import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { useAppColors } from "../../../../hooks/useAppColors";

const colorOptions = Array.from(new Set([
    "#FFFFFF", "#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#5AC8FA", "#007AFF", "#AF52DE", "#FF2D55",
    "#F2F2F7", "#FFD8D6", "#FFECD0", "#FFF5CC", "#D4F5D6", "#D6F1FC", "#CCE4FF", "#EFE2FB", "#FFD6E0",
    "#E5E5EA", "#FFAAA6", "#FFD8A6", "#FFEB9A", "#A9ECB4", "#A6E4F8", "#99CCF5", "#D8BCEF", "#FFA6BA",
    "#8E8E93", "#000000", "#A81917", "#A85900", "#A88700", "#236B36", "#3B7B98", "#004C99", "#750D91", "#A8183B",
]));


interface footerComponentProps {
    colorDraw: string;
    changeDrawColor: (value: string) => void
}

const ColorOptionComponent = ({ colorDraw, changeDrawColor }: footerComponentProps) => {
    const colors = useAppColors();
    return (
        <View style={[styles.colorPickerContainer, { backgroundColor: colors.background.edit_image }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {colorOptions.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => changeDrawColor(color)}
                        style={[
                            styles.colorBox,
                            { backgroundColor: color },
                            colorDraw === color ? styles.selectedColor : {},
                        ]}
                    />
                ))}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    selectedColor: {
        borderColor: "skyblue",
    },
    colorBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: "transparent",
    },
    colorPickerContainer: {
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default ColorOptionComponent