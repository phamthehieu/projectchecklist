import React from 'react';
import { Text } from '@gluestack-ui/themed';
import { useNetwork } from '../../../contexts/NetworkContext';
import { useAppColors } from '../../../hooks/useAppColors';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export const NetworkStatus: React.FC = () => {
    const { isConnected, type } = useNetwork();
    const colors = useAppColors();
    if (isConnected) return null;

    return (
        <View style={styles.content}>
            <View style={styles.box}>
                <ActivityIndicator
                    size="large"
                    color={colors.tailwind.blue[500]}
                />
                <Text
                    style={{
                        paddingHorizontal: 16,
                        textAlign: 'center',
                        marginTop: 8,
                        fontSize: 14,
                        color: colors.tailwind.blue[500],
                    }}>
                    {type === 'none' ? 'Không có kết nối mạng' : 'Kết nối mạng không ổn định'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white",
        minHeight: 100,
        minWidth: 100,
        borderRadius: 12,
        maxWidth: (width * 2) / 3,
    },
});