import { useRef, useState } from "react";
import { Animated, Dimensions, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import { useAppColorMode } from "../ColorModeContext";


interface AnimatedInputProps {
    value: string;
    onChange: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    maxLength?: number;
    upcase?: boolean;
    keyboardType?: any;
    labelRequired?: boolean
}

const { width, height } = Dimensions.get('window');

const AnimatedInput: React.FC<AnimatedInputProps> = ({ value, onChange, placeholder, multiline, containerStyle, maxLength, upcase, keyboardType, labelRequired }) => {
    const [inputHeight, setHeight] = useState(0);
    const [placeholderWidth, setWidth] = useState<number | null>(null);
    const animation = useRef(new Animated.Value(0)).current;
    const { colorMode } = useAppColorMode();

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -inputHeight / 2],
    });
    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -(placeholderWidth ?? 0) / 4],
    });
    const scale = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
    });
    const onFocus = () => animate(1);
    const onBlur = () => !value && animate(0);
    const animate = (val: number) => {
        Animated.spring(animation, {
            toValue: val,
            bounciness: 0,
            useNativeDriver: true,
        }).start();
    };
    return (
        <View
            style={[styles.inputContainer, containerStyle]}
            onLayout={e => !inputHeight && setHeight(e.nativeEvent.layout.height)}>
            <View style={{ height: inputHeight, ...styles.placeholderContainer }}>
                <Animated.Text
                    style={[
                        styles.placeholder,
                        { transform: [{ translateY }, { translateX }, { scale }], backgroundColor: colorMode === "dark" ? "#171717" : '#fff' },
                    ]}
                    onTextLayout={e =>
                        !placeholderWidth && setWidth(e.nativeEvent.lines[0]?.width || 0)
                    }>
                    {placeholder} {labelRequired && <Text style={{ color: 'red' }}>*</Text>}
                </Animated.Text>
            </View>
            <TextInput
                autoCapitalize={upcase ? 'characters' : "none"}
                maxLength={maxLength}
                style={[styles.input, multiline && { minHeight: 48, flex: 1, textAlignVertical: 'top', width: width, color: colorMode === "dark" ? "white" : "black" }]}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChange}
                multiline={multiline}
                keyboardType={keyboardType}
            />
        </View>
    );
}

export default AnimatedInput;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#999',
        marginBottom: 5,
        width: width - 40
    },
    input: {
        paddingHorizontal: 10,
        fontSize: 18,
    },
    placeholderContainer: {
        position: 'absolute',
        backgroundColor: 'red',
        justifyContent: 'center',
    },
    placeholder: {
        fontSize: 18,
        position: 'absolute',
        marginHorizontal: 5,
        paddingHorizontal: 5,
        color: '#999',
    },
});