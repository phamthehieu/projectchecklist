import React, { useState, ComponentProps } from 'react';
import { Dimensions } from 'react-native'; // Nhập Dimensions để lấy kích thước màn hình
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Text,
    Textarea,
    TextareaInput,
    FormControlError,
    FormControlErrorText,
} from '@gluestack-ui/themed';
import { useAppColors } from '../../../hooks/useAppColors';

// Lấy chiều rộng màn hình (chưa sử dụng trong code hiện tại)
const { width } = Dimensions.get('window');

// Định nghĩa các pattern validation
const VALIDATION_PATTERNS = {
    phone: /^[0-9]{10,11}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
    number: /^\d+$/,
};

// Định nghĩa các loại trường có thể validate
type FieldType = 'phone' | 'email' | 'url' | 'number' | 'text';

interface TemplateField {
    label: string;
    type: FieldType;
    required?: boolean;
}

// Định nghĩa interface TextareaComponentProps để mô tả các thuộc tính của TextareaComponent
interface TextareaComponentProps extends Omit<ComponentProps<typeof Textarea>, 'children'> {
    label?: string; // Nhãn của textarea (tùy chọn)
    labelRequired?: boolean; // Xác định nhãn có đánh dấu bắt buộc hay không
    size?: "lg" | "md" | "sm"; // Kích thước của textarea
    borderRadius?: number; // Độ bo góc của textarea
    placeholder?: string; // Văn bản placeholder trong textarea
    isReadOnly?: boolean; // Xác định textarea có chỉ đọc hay không
    value?: string; // Giá trị của textarea
    onChangeText?: (text: string) => void; // Callback khi nội dung textarea thay đổi
    textareaInputProps?: Omit<ComponentProps<typeof TextareaInput>, 'value' | 'onChangeText'>;
    template?: string; // Thêm prop template
    templateFields?: TemplateField[];
    onValidationError?: (errors: { [key: string]: string }) => void;
    containerStyle?: any;
}

// Component TextareaComponent là một textarea tùy chỉnh
const TextareaComponent: React.FC<TextareaComponentProps> = ({
    label, // Nhãn mặc định
    size = "md", // Kích thước mặc định là trung bình
    borderRadius = 12, // Độ bo góc mặc định
    placeholder = "Nhập nội dung...", // Placeholder mặc định
    isReadOnly, // Mặc định không chỉ đọc
    value,
    onChangeText,
    labelRequired,
    textareaInputProps,
    template,
    templateFields = [],
    onValidationError,
    containerStyle,
    ...restTextareaProps
}) => {
    const colors = useAppColors();
    const [isFocused, setIsFocused] = useState(false); // Trạng thái focus của textarea
    const [showTemplate, setShowTemplate] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});


    const validateField = (value: string, type: FieldType, required: boolean = false): string | null => {
        if (required && !value.trim()) {
            return 'Trường này là bắt buộc';
        }

        if (!value.trim()) return null;

        switch (type) {
            case 'phone':
                return VALIDATION_PATTERNS.phone.test(value) ? null : 'Số điện thoại không hợp lệ';
            case 'email':
                return VALIDATION_PATTERNS.email.test(value) ? null : 'Email không hợp lệ';
            case 'url':
                return VALIDATION_PATTERNS.url.test(value) ? null : 'URL không hợp lệ';
            case 'number':
                return VALIDATION_PATTERNS.number.test(value) ? null : 'Vui lòng nhập số';
            default:
                return null;
        }
    };

    const validateTemplate = (text: string) => {
        const newErrors: { [key: string]: string } = {};
        const lines = text.split('\n');

        templateFields.forEach((field, index) => {
            if (index < lines.length) {
                const value = lines[index].split(':')[1]?.trim() || '';
                const error = validateField(value, field.type, field.required);
                if (error) {
                    newErrors[field.label] = error;
                }
            }
        });

        setErrors(newErrors);
        onValidationError?.(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (template && showTemplate && !value) {
            onChangeText?.(template);
            setShowTemplate(false);
        }
    };

    const handleChangeText = (text: string) => {
        onChangeText?.(text);
        if (templateFields.length > 0) {
            validateTemplate(text);
        }
    };

    return (
        <FormControl size={size} w="$full" isInvalid={Object.keys(errors).length > 0} style={containerStyle}>
            {label && (
                <FormControlLabel>
                    <FormControlLabelText color={colors.text.primary} mb="$2">
                        <Text color={colors.text.primary}>
                            {label} {/* Nhãn */}
                            {labelRequired && <Text color={colors.tailwind.red[500]}>*</Text>}
                        </Text>
                    </FormControlLabelText>
                </FormControlLabel>
            )}

            <Textarea
                minHeight={120}
                bgColor={colors.background.primary} // Màu nền theo chế độ màu
                borderRadius={borderRadius} // Độ bo góc
                isReadOnly={isReadOnly} // Trạng thái chỉ đọc
                borderColor={isFocused ? colors.tailwind.blue[500] : colors.border.light} // Màu viền thay đổi theo focus
                borderWidth={1} // Độ dày viền
                {...restTextareaProps}
            >
                <TextareaInput
                    readOnly={isReadOnly}
                    multiline={true}
                    placeholder={placeholder}
                    value={value} // Giá trị của textarea
                    onChangeText={handleChangeText} // Callback khi thay đổi nội dung
                    color={colors.text.primary} // Màu chữ theo chế độ
                    onFocus={handleFocus} // Cập nhật trạng thái focus
                    onBlur={() => setIsFocused(false)} // Bỏ trạng thái focus
                    {...textareaInputProps}
                />
            </Textarea>

            {Object.entries(errors).map(([field, error]) => (
                <FormControlError key={field}>
                    <FormControlErrorText color={colors.tailwind.red[500]}>
                        {field}: {error}
                    </FormControlErrorText>
                </FormControlError>
            ))}
        </FormControl>
    );
};

export default TextareaComponent; // Xuất component để sử dụng ở nơi khác