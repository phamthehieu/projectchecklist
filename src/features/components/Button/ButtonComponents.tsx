import React from 'react';
import { Dimensions, ViewStyle } from 'react-native'; // Lấy kích thước màn hình từ react-native
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@gluestack-ui/themed'; // Các component từ thư viện gluestack-ui
import { useAppColorMode } from '../ColorModeContext'; // Hook để lấy chế độ màu (dark/light)
import { useAppColors } from '../../../hooks/useAppColors';

// Lấy chiều rộng và chiều cao của màn hình thiết bị
const { width, height } = Dimensions.get('window');

type ButtonType = 'default' | 'add' | 'delete' | 'edit' | 'save' | 'cancel';

// Định nghĩa interface ButtonProps để mô tả các thuộc tính mà ButtonComponents nhận vào
interface ButtonProps {
    size?: "xs" | "sm" | "md" | "lg" | "xl"; // Kích thước của button
    variant?: "link" | "outline" | "solid"; // Kiểu hiển thị của button (link, viền, hoặc đầy màu)
    action?: "primary" | "secondary" | "positive" | "negative" | "default"; // Loại hành động để thay đổi màu sắc hoặc ý nghĩa
    marginTop?: number; // Khoảng cách phía trên của button
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    padding?: number;
    radius?: string; // Độ bo góc của button (border radius)
    title?: string; // Tiêu đề hiển thị trên button
    loading?: boolean; // Trạng thái loading (hiển thị spinner)
    showTitle?: boolean; // Xác định có hiển thị tiêu đề hay không
    showIconLeft?: boolean; // Xác định có hiển thị icon bên trái hay không
    iconLeft?: any; // Icon bên trái (component hoặc biểu tượng)
    iconLeftColor?: string;
    iconLeftSize?: "xs" | "sm" | "md" | "lg" | "xl";
    showIconRight?: boolean; // Xác định có hiển thị icon bên phải hay không
    iconRight?: any; // Icon bên phải (component hoặc biểu tượng)
    iconRightColor?: string;
    iconRightSize?: "xs" | "sm" | "md" | "lg" | "xl";
    onPress?: () => void; // Callback khi button được nhấn
    onLongPress?: () => void; // Callback khi button được nhấn giữ lâu
    disabled?: boolean;
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderWidth?: number;
    width?: number;
    height?: number;
    alignSelf?: "auto" | "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
    alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
    opacity?: number;
    elevation?: number;
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
    type?: ButtonType;
    marginText?: number;
}

// Component ButtonComponents là một button tùy chỉnh với nhiều tùy chọn
const ButtonComponents: React.FC<ButtonProps> = ({
    size = 'xl', // Kích thước mặc định là "xl"
    variant = "outline", // Kiểu mặc định là viền (outline)
    action = "primary", // Hành động mặc định là chính (primary)
    type = 'default',
    marginTop = 40, // Khoảng cách trên mặc định là 40
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
    padding = 0,
    radius = 12,
    title = "Hello World!", // Tiêu đề mặc định
    showTitle = true, // Mặc định hiển thị tiêu đề
    loading = false, // Mặc định không ở trạng thái loading
    showIconLeft, // Không có giá trị mặc định, phụ thuộc vào việc truyền từ ngoài vào
    iconLeft,
    iconLeftColor,
    iconLeftSize,
    showIconRight, // Không có giá trị mặc định, phụ thuộc vào việc truyền từ ngoài vào
    iconRight,
    iconRightColor,
    iconRightSize,
    onPress,
    onLongPress,
    disabled = false,
    backgroundColor,
    textColor,
    borderColor,
    borderWidth,
    width,
    height,
    alignSelf = "stretch",
    justifyContent = "center",
    alignItems = "center",
    opacity = 1,
    elevation = 0,
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    marginText = 10,
}) => {
    const colors = useAppColors();

    // Tự động áp dụng style dựa trên loại nút
    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            padding,
            borderRadius: Number(radius),
            backgroundColor,
            borderColor,
            borderWidth,
            width,
            height,
            alignSelf,
            justifyContent,
            alignItems,
            opacity: disabled ? 0.5 : opacity,
            elevation,
            shadowColor,
            shadowOffset,
            shadowOpacity,
            shadowRadius,
        };

        switch (type) {
            case 'add':
                return {
                    ...baseStyle,
                    backgroundColor: backgroundColor || colors.tailwind.green[500],
                    borderColor: borderColor || colors.tailwind.green[600],
                };
            case 'delete':
                return {
                    ...baseStyle,
                    backgroundColor: backgroundColor || colors.tailwind.red[500],
                    borderColor: borderColor || colors.tailwind.red[600],
                };
            case 'edit':
                return {
                    ...baseStyle,
                    backgroundColor: backgroundColor || colors.tailwind.blue[500],
                    borderColor: borderColor || colors.tailwind.blue[600],
                };
            case 'save':
                return {
                    ...baseStyle,
                    backgroundColor: backgroundColor || colors.tailwind.blue[500],
                    borderColor: borderColor || colors.tailwind.blue[600],
                };
            case 'cancel':
                return {
                    ...baseStyle,
                    backgroundColor: backgroundColor || colors.tailwind.gray[500],
                    borderColor: borderColor || colors.tailwind.gray[600],
                };
            default:
                return baseStyle;
        }
    };

    // Tự động áp dụng màu chữ dựa trên loại nút
    const getTextColor = (): string => {
        if (textColor) return textColor;

        switch (type) {
            case 'add':
            case 'delete':
            case 'edit':
            case 'save':
            case 'cancel':
                return colors.tailwind.white;
            default:
                return colors.tailwind.gray[900];
        }
    };

    const buttonStyle = getButtonStyle();
    const finalTextColor = getTextColor();

    // Render giao diện của button
    return (
        <Button
            size={size} // Áp dụng kích thước
            variant={variant} // Áp dụng kiểu hiển thị
            action={action} // Áp dụng loại hành động
            style={buttonStyle}
            onPress={onPress} // Gắn sự kiện nhấn
            onLongPress={onLongPress} // Gắn sự kiện nhấn giữ lâu
            disabled={disabled || loading}
        >
            {/* Hiển thị icon bên trái nếu được yêu cầu */}
            {showIconLeft && (
                <ButtonIcon as={iconLeft} color={iconLeftColor || finalTextColor} size={iconLeftSize || "md"} />
            )}
            {/* Hiển thị spinner nếu button đang ở trạng thái loading */}
            {loading && (
                <ButtonSpinner color={finalTextColor} />
            )}
            {/* Hiển thị tiêu đề nếu được yêu cầu */}
            {showTitle && (
                <ButtonText
                    margin={marginText}
                    ml="$2"
                    mr="$2"
                    fontSize="$sm"
                    color={finalTextColor}
                >
                    {title}
                </ButtonText>
            )}
            {/* Hiển thị icon bên phải nếu được yêu cầu */}
            {showIconRight && (
                <ButtonIcon as={iconRight} color={iconRightColor || finalTextColor} size={iconRightSize || "md"} />
            )}
        </Button>
    );
};

export default ButtonComponents; // Xuất component để sử dụng ở nơi khác