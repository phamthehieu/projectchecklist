import { Icon, Input, InputField, InputIcon, InputSlot, FormControl, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText, FormControlError, FormControlErrorText, Text, Pressable } from '@gluestack-ui/themed';
import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Eye, EyeOff } from "lucide-react-native";
import { useAppColors } from '../../../hooks/useAppColors';
// Định nghĩa interface Props để xác định các thuộc tính mà component AppTextField nhận vào
interface Props {
  secure?: boolean; // Xác định xem input có phải là mật khẩu hay không
  onRightIconPress?: () => void; // Callback khi nhấn vào icon bên phải
  labelRequired?: boolean; // Xác định xem label có yêu cầu trường bắt buộc không
  label?: string; // Nhãn của input
  placeholder?: string; // Văn bản placeholder trong input
  containerStyle?: ViewStyle; // Style tùy chỉnh cho container bao ngoài
  inputStyle?: TextStyle; // Style tùy chỉnh cho TextInput
  inputContainerStyle?: ViewStyle; // Style tùy chỉnh cho container của input
  leftIcon?: any; // Icon hiển thị bên trái input
  keyboardType?: any; // Loại bàn phím hiển thị (ví dụ: numeric, email, v.v.)
  value?: string; // Giá trị của input
  onChangeText?: (text: string) => void; // Callback khi giá trị input thay đổi
  onBlur?: (e: any) => void; // Callback khi input mất focus
  onFocus?: (e: any) => void; // Callback khi input nhận focus
  readOnly?: boolean; // Xác định input có chỉ đọc hay không
  rightIcon?: any; // Icon tùy chỉnh hiển thị bên phải input
  onSubmitEditing?: () => void; // Callback khi nhấn nút submit trên bàn phím
  returnKeyType?: any; // Loại nút return trên bàn phím (ví dụ: "done", "next")
  chuthich?: string; // Chú thích bổ sung cho label
  multiline?: boolean; // Xác định input có hỗ trợ nhiều dòng hay không
  upcase?: boolean; // Xác định liệu văn bản có tự động chuyển thành chữ in hoa hay không
  showLabel?: boolean;
  showChuThich?: boolean;
  showiconLeft?: boolean;
  showiconRight?: boolean;
  colorIconLeft?: string;
  colorIconRight?: string;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  testID?: string;
  borderRadius?: number;
  size?: "sm" | "md" | "lg" | "xl";
  height?: number;
}

// Component AppTextField là một trường nhập liệu tùy chỉnh với nhiều tính năng
const AppTextField: React.FC<Props> = (props) => {
  // Destructure các props và gán giá trị mặc định nếu cần
  const {
    secure = false, // Mặc định không phải input mật khẩu
    containerStyle,
    inputContainerStyle,
    inputStyle,
    leftIcon,
    showiconLeft,
    showiconRight,
    placeholder,
    onRightIconPress,
    label,
    labelRequired,
    value,
    onChangeText,
    keyboardType,
    onBlur,
    readOnly,
    onFocus,
    rightIcon: customRightIcon, // Icon bên phải tùy chỉnh từ props
    onSubmitEditing,
    returnKeyType,
    chuthich,
    multiline = false, // Mặc định không hỗ trợ nhiều dòng
    upcase = false, // Mặc định không chuyển thành chữ in hoa
    showLabel = true,
    showChuThich = true,
    colorIconLeft = "#5db7e9",
    colorIconRight = "#5db7e9",
    maxLength = 249,
    autoCapitalize = 'none',
    error,
    disabled = false,
    borderRadius = 12,
    testID,
    size = "md",
    height = 48,
    ...rest // Các props khác được truyền vào TextInput
  } = props;

  const colors = useAppColors();
  const [secureText, setSecureText] = useState(secure); // Trạng thái ẩn/hiện mật khẩu

  // Hàm toggle để ẩn/hiện mật khẩu khi nhấn icon bên phải
  const toggleSecureText = useCallback(() => {
    setSecureText((prev) => !prev); // Đổi trạng thái ẩn/hiện
    onRightIconPress?.(); // Gọi callback nếu được cung cấp
  }, [onRightIconPress]);

  // Tạo icon bên phải dựa trên loại input (mật khẩu hoặc tùy chỉnh)
  const rightIcon = useMemo(() => {
    if (customRightIcon) {
      return customRightIcon; // Sử dụng icon tùy chỉnh nếu được truyền vào
    }

    if (secure) {
      // Nếu là input mật khẩu, hiển thị icon Eye/EyeOff để ẩn/hiện
      return (
        <Pressable onPress={toggleSecureText} disabled={disabled}>
          <InputIcon
            as={secureText ? Eye : EyeOff}
            color={colorIconRight}
          />
        </Pressable>
      );
    }

    return null;
  }, [customRightIcon, secure, secureText, toggleSecureText, disabled, colorIconRight]);

  const handleChangeText = (text: string) => {
    if (keyboardType === 'numeric') {
      const filteredText = text.replace(/\s/g, '');
      onChangeText?.(filteredText);
    } else {
      onChangeText?.(text);
    }
  };

  return (
    <FormControl isInvalid={!!error} isDisabled={disabled} style={containerStyle}>
      {showLabel && label && (
        <FormControlLabel mb="$1">
          <FormControlLabelText color={colors.text.primary}>
            {label} {labelRequired && <Text color="$red500">*</Text>}
            {showChuThich && chuthich && (
              <Text color="$red900" fontSize="$xs" ml="$1">
                ({chuthich})
              </Text>
            )}
          </FormControlLabelText>
        </FormControlLabel>
      )}

      <Input
        variant="outline"
        size={size}
        isDisabled={disabled}
        isReadOnly={readOnly}
        isInvalid={!!error}
        borderColor={error ? colors.tailwind.red[500] : colors.tailwind.gray[300]}
        bg={colors.background.card}
        borderRadius={borderRadius}
        height={height}
        sx={{
          ":focus": {
            borderColor: colors.tailwind.blue[500]
          },
          ":hover": {
            borderColor: colors.tailwind.gray[400]
          }
        }}
      >
        {showiconLeft && leftIcon && (
          <InputSlot pl="$3">
            <InputIcon as={leftIcon} color={colorIconLeft} />
          </InputSlot>
        )}
        <InputField
          size={size}
          testID={testID}
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          secureTextEntry={secureText}
          autoCapitalize={upcase ? 'characters' : autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          style={inputStyle}
          backgroundColor={colors.background.card}
          {...rest}
        />
        {showiconRight && rightIcon && (
          <InputSlot pr="$3">
            {rightIcon}
          </InputSlot>
        )}
      </Input>

      {error && (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      )}

      {chuthich && !error && (
        <FormControlHelper>
          <FormControlHelperText>{chuthich}</FormControlHelperText>
        </FormControlHelper>
      )}
    </FormControl>
  );
};

export default AppTextField; // Xuất component để sử dụng ở nơi khác