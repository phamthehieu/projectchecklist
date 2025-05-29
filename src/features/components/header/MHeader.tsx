import { Icon } from '@gluestack-ui/themed';
import React from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { ArrowLeft, Trash2 } from "lucide-react-native";
import { useAppColors } from '../../../hooks/useAppColors';

interface IProps {
    label?: string;
    showFilter?: boolean;
    placeHolder?: string;
    value?: string;
    onChangeText?: (value: string) => void;
    onSearch?: () => void;
    onFilter?: () => void;
    onBack?: () => void;
    showConfig?: boolean;
    viewType?: 'grid' | 'list';
    changeViewType?: () => void;
    scrollY?: any;
    iconRight?: React.ReactNode;
    onPressIconRight?: () => void;
    isFilter?: boolean;
    showiconLeft?: boolean;
    showIconRight?: boolean;
    bgColor?: string;
}

export default function MHeader({
    label,
    onBack,
    iconRight,
    onPressIconRight,
    showiconLeft,
    showIconRight,
    bgColor
}: IProps) {
    const colors = useAppColors();
    return (
        <View style={[{ backgroundColor: bgColor }]}>
            <View style={[styles.header, { marginTop: 18 }]}>
                {showiconLeft &&
                    <TouchableOpacity style={styles.iconLeft} onPress={onBack}>
                        <Icon as={ArrowLeft} size="lg" color={colors.text.primary} />
                    </TouchableOpacity>
                }
                <Text style={[styles.label, { color: colors.text.primary }]}>{label}</Text>
                {/* {showConfig && (
                    <TouchableOpacity style={styles.iconRight} onPress={changeViewType}>
                        {viewType === 'list' ?
                            <Icon
                                name="arrow-back-outline"
                                type="ionicon"
                                size={24}
                                color={"blue"}
                            /> : viewType === 'grid' ?
                                <Icon
                                    name="arrow-back-outline"
                                    type="ionicon"
                                    size={24}
                                    color={"blue"}
                                /> : null}
                    </TouchableOpacity>
                )} */}
                {showIconRight && (
                    <TouchableOpacity style={[styles.iconRight, { backgroundColor: colors.background.card }]} onPress={onPressIconRight}>
                        {iconRight}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    iconLeft: {
        width: 40,
        height: 40,
        position: 'absolute',
        left: 8,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    iconRight: {
        width: 40,
        height: 40,
        position: 'absolute',
        right: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: "white",
        fontSize: 18,
    },
    search: {
        paddingHorizontal: 24,
        paddingBottom: 8,
    },
    filterRow: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
