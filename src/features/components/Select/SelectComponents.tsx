import React, { useState, useMemo, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectItem,
    Icon,
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    Input,
    InputField,
    InputIcon,
    InputSlot,
    Text,
    ScrollView,
    Box
} from '@gluestack-ui/themed';
import { ChevronDownIcon, Search } from 'lucide-react-native';
import { useAppColors } from '../../../hooks/useAppColors';

const { width, height } = Dimensions.get('window');

interface SelectOption {
    label: string;
    value: string;
    isDisabled?: boolean;
}

interface SelectComponentProps {
    options: SelectOption[];
    placeholder?: string;
    selectedValue?: SelectOption;
    onValueChange?: (value: string) => void;
    showIconLeft?: boolean;
    iconLeft?: any;
    label?: string;
    labelRequired?: boolean;
    chuthich?: string;
    readonly?: boolean;
    style?: any;
    variant?: 'underlined' | 'outline' | 'rounded';
    size?: "sm" | "md" | "lg" | "xl";
    heightProps?: number;
    borderRadius?: number;
    getFilteredOptions?: () => number[];
}

const SelectComponent: React.FC<SelectComponentProps> = ({
    options,
    placeholder,
    selectedValue,
    onValueChange,
    showIconLeft,
    iconLeft,
    label,
    labelRequired,
    chuthich,
    readonly,
    style,
    variant = 'outline',
    size = "md",
    heightProps = 48,
    borderRadius = 12,
    getFilteredOptions
}) => {
    const colors = useAppColors();
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredOptions = useMemo(() => {
        if (getFilteredOptions) {
            const indices = getFilteredOptions();
            if (Array.isArray(indices)) {
                return options.filter((_, index) => indices.includes(index));
            }
        }
        return options.filter(option =>
            option.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, getFilteredOptions, search]);

    return (
        <FormControl style={style} isDisabled={readonly}>
            {label && (
                <FormControlLabel mb="$1">
                    <FormControlLabelText color={colors.text.primary}>
                        {label}
                        {labelRequired && <Text color="$red500">*</Text>}
                        {chuthich && (
                            <Text color="$red900" fontSize="$xs" ml="$1">
                                ({chuthich})
                            </Text>
                        )}
                    </FormControlLabelText>
                </FormControlLabel>
            )}

            <Select
                selectedValue={selectedValue?.value}
                onValueChange={onValueChange}
                isDisabled={readonly}
            >
                <SelectTrigger
                    variant={variant}
                    size={size}
                    height={heightProps}
                    borderRadius={borderRadius}
                    bg={colors.background.card}
                    borderColor={colors.tailwind.gray[300]}
                    sx={{
                        ":focus": {
                            borderColor: colors.tailwind.blue[500]
                        },
                        ":hover": {
                            borderColor: colors.tailwind.gray[400]
                        }
                    }}
                >
                    {showIconLeft && (
                        <InputSlot pl="$3">
                            <InputIcon as={iconLeft} color="#5db7e9" />
                        </InputSlot>
                    )}
                    <SelectInput
                        placeholder={placeholder}
                        color={colors.text.primary}
                        fontSize="$sm"
                    />
                    <SelectIcon mr="$2" as={ChevronDownIcon} color={colors.text.primary} />
                </SelectTrigger>

                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent bg={colors.background.card}>
                        <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>

                        <Box p="$2" pb="$0">
                            <Input
                                variant="outline"
                                size="md"
                                borderRadius={borderRadius}
                                bg={colors.background.card}
                                borderColor={colors.tailwind.gray[300]}
                                height={48}
                                w={width * 0.9}
                            >
                                <InputSlot pl="$3">
                                    <InputIcon as={Search} color={colors.text.primary} />
                                </InputSlot>
                                <InputField
                                    value={search}
                                    onChangeText={setSearch}
                                    placeholder="Tìm kiếm..."
                                    color={colors.text.primary}
                                    fontSize="$sm"
                                    autoCapitalize="none"
                                />
                            </Input>
                        </Box>

                        <ScrollView
                            maxHeight={height * 0.4}
                            width={width * 0.9}
                            mt="$2"
                        >
                            {filteredOptions.length === 0 ? (
                                <Text
                                    textAlign="center"
                                    color="$gray400"
                                    p="$4"
                                >
                                    Không tìm thấy dữ liệu
                                </Text>
                            ) : (
                                filteredOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                        isDisabled={option.isDisabled}
                                        textStyle={{ color: colors.text.primary }}
                                    />
                                ))
                            )}
                        </ScrollView>
                    </SelectContent>
                </SelectPortal>
            </Select>
        </FormControl>
    );
};

export default SelectComponent;
