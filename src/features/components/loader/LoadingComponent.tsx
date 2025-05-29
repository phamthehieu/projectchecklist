import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';

interface IProps {
    loading: boolean;
    title?: string;
    color?: string;
}

const { width } = Dimensions.get('window');
export default function Loader({ loading, title, color }: IProps) {
    return (
        <>
            {loading && (
                <View style={styles.content}>
                    <View style={styles.box}>
                        <ActivityIndicator
                            size="large"
                            color={color || '#5db7e9'}
                        />
                        {!!title && (
                            <Text
                                style={{
                                    paddingHorizontal: 16,
                                    textAlign: 'center',
                                    marginTop: 8,
                                    fontSize: 14,
                                    color: color || '#5db7e9',
                                }}>
                                {title}
                            </Text>
                        )}
                    </View>
                </View>
            )}
        </>
    );
}
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
