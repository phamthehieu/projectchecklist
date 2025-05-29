import React, { useRef, useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { G, Path, Svg } from "react-native-svg";
import { useAppColors } from "../../../../hooks/useAppColors";

interface SampleDrawingComponentProps {
    addElementToSvg: (element: JSX.Element) => void;
    colorDraw: string;
}

const SampleDrawingComponent = ({ addElementToSvg, colorDraw }: SampleDrawingComponentProps) => {
    const colors = useAppColors();
    const elements = [
        {
            id: "circle",
            element: (
                <G transform="translate(10, 10)">
                    <Path
                        d="M25 0 A25 25 0 1 1 24.9 0 Z"
                        fill="none"
                        stroke={colorDraw}
                        strokeWidth="2"
                        scale={1.5}
                    />
                </G>
            )
        },
        {
            id: "arrow",
            element: (
                <G transform="translate(5, 5)">
                    <Path
                        d="M0 20 L40 20 L40 10 L60 30 L40 50 L40 40 L0 40 Z"
                        fill="none"
                        stroke={colorDraw}
                        strokeWidth="2"
                        scale={1.5}
                    />
                </G>
            )
        },
        {
            id: "triangle",
            element: (
                <G transform="translate(5, 5)">
                    <Path
                        d="M30 10 L10 50 L50 50 Z"
                        fill="none"
                        stroke={colorDraw}
                        strokeWidth="2"
                        scale={1.5}
                    />
                </G>
            )
        },
        {
            id: "star",
            element: (
                <G >
                    <Path
                        d="M50 15 L61 39 L87 39 L66 57 L75 85 L50 70 L25 85 L34 57 L13 39 L39 39 Z"
                        fill="none"
                        stroke={colorDraw}
                        strokeWidth="2"
                        scale={1}
                    />
                </G>
            )
        },
        {
            id: "square",
            element: (
                <G transform="translate(5, 5)">
                    <Path
                        d="M10 10 H50 V50 H10 Z"
                        fill="none"
                        stroke={colorDraw}
                        strokeWidth="2"
                        scale={1.5}
                    />
                </G>
            )
        },

    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background.edit_image }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {elements.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.elementBox}
                        onPress={() => addElementToSvg(item.element)}
                    >
                        <Svg width={50} height={50} viewBox="0 0 100 100">
                            {item.element}
                        </Svg>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    elementBox: {
        marginHorizontal: 10,
        padding: 10,
        backgroundColor: "#FBFBFB9E",
        borderRadius: 5,
    },
});

export default SampleDrawingComponent;
