import React, { useState } from 'react';
import {
    Actionsheet,
    ActionsheetContent,
    ActionsheetItem,
    ButtonText,
    ActionsheetItemText,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetBackdrop,
    Box, Switch, Icon,
    AlertDialogFooter,
    AlertDialogContent,
    Text, AlertDialog,
    Input, InputField,
    Button, VStack, HStack,
    AlertDialogBody
} from "@gluestack-ui/themed";
import { useAppColorMode } from '../ColorModeContext';
import { Badge, BadgeInfo, CheckIcon, ChevronRight, Menu, Pencil, UserRound, UserRoundPen, Wrench } from "lucide-react-native";
import { Pressable, TextInput, TouchableOpacity } from 'react-native';
import { useAppColors } from '../../../hooks/useAppColors';
// Định nghĩa interface cho mỗi mục trong Actionsheet
interface ActionItem {
    key: string; // Khóa duy nhất cho mỗi mục
    label: string; // Nhãn hiển thị của mục
    isDisabled?: boolean; // Trạng thái vô hiệu hóa (tùy chọn)
    onPress?: (text?: any) => void; // Callback khi nhấn vào mục (tùy chọn)
    view?: React.ReactNode;
    isSelected?: boolean;
    value?: string;
    showValue?: boolean;
    onValue?: (text?: any) => void;
    isShowIcon?: boolean;
    onIconPress?: (icon?: object) => void;
    icon?: object;
    colorIcon?: string;
    onColorIconPress?: (color?: string) => void;
}

interface ActionsheetComponentProps {
    triggerLabel?: string;
    items: ActionItem[];
    isOpen?: boolean;
    onOpen?: () => void;
    onClose?: () => void;
    showDragIndicator?: boolean;
    triggerProps?: object;
    contentProps?: object;
}

const colorOptions = Array.from(new Set([
    "#FFFFFF", "#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#5AC8FA", "#007AFF", "#AF52DE", "#FF2D55",
    "#F2F2F7", "#FFD8D6", "#FFECD0", "#FFF5CC", "#D4F5D6", "#D6F1FC", "#CCE4FF", "#EFE2FB", "#FFD6E0",
    "#E5E5EA", "#FFAAA6", "#FFD8A6", "#FFEB9A", "#A9ECB4", "#A6E4F8", "#99CCF5", "#D8BCEF", "#FFA6BA",
    "#8E8E93", "#000000", "#A81917", "#A85900", "#A88700", "#236B36", "#3B7B98", "#004C99", "#750D91", "#A8183B",
]));

const sourceIcon = Array.from(new Set([
    <BadgeInfo />, <Menu />, <ChevronRight />, <Badge />, <CheckIcon />, <Pencil />,
    <UserRound />, <UserRoundPen />, <Wrench />
]));

const ActionsheetItemSetting: React.FC<ActionsheetComponentProps> = ({
    items = [],
    isOpen: controlledIsOpen,
    onOpen,
    onClose,
    contentProps = {},
}) => {

    const [internalIsOpen, setInternalIsOpen] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isDialogColorOpen, setIsDialogColorOpen] = React.useState(false);
    const [valueInput, setValueInput] = useState("");
    const [activeItemKey, setActiveItemKey] = useState<string | null>(null);

    const [selectedColor, setSelectedColor] = useState("#FF3B30");
    const [opacity, setOpacity] = useState(100);

    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    const handleClose = () => {
        setInternalIsOpen(false);
        if (onClose) onClose();
    };

    const colors = useAppColors();

    const handleOpenDialog = (item: ActionItem) => {
        setActiveItemKey(item.key);
        setValueInput(item.value?.toString() || "");
        setIsDialogOpen(true);
    };

    const handleConfirm = () => {
        if (isDialogOpen) {
            const activeItem = items.find(item => item.key === activeItemKey);
            if (activeItem && activeItem.onValue) {
                activeItem.onValue(valueInput);
            }
            setIsDialogOpen(false);
        } else if (isDialogColorOpen) {
            const activeItem = items.find(item => item.key === activeItemKey);
            if (activeItem && activeItem.onColorIconPress) {
                activeItem.onColorIconPress(selectedColor);
            }
            setIsDialogColorOpen(false);
        }
    };

    // Hàm chuyển đổi màu Hex sang RGBA
    const convertHexToRGBA = (hex: string, opacity: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    };

    // Hàm xử lý thay đổi giá trị thanh trượt
    const handleSliderChange = (value: number) => {
        setOpacity(value);
    };

    // Hàm xử lý mở dialog màu
    const handleOpenColorDialog = (item: ActionItem) => {
        setActiveItemKey(item.key);
        setIsDialogColorOpen(true);
    };

    const renderColorGrid = () => {
        // Tạo 5 hàng, mỗi hàng 9 màu
        const rows = 5;
        const colorsPerRow = 6;
        const colorGrid = [];

        for (let row = 0; row < rows; row++) {
            const rowColors = [];
            for (let col = 0; col < colorsPerRow; col++) {
                const colorIndex = row * colorsPerRow + col;
                rowColors.push(
                    <Pressable
                        key={colorIndex}
                        onPress={() => setSelectedColor(colorOptions[colorIndex])}
                    >
                        <Box
                            width={36}
                            height={36}
                            borderRadius="$full"
                            backgroundColor={colorOptions[colorIndex]}
                            opacity={opacity / 100}
                            borderWidth={selectedColor === colorOptions[colorIndex] ? 3 : 0}
                            borderColor={colors.tailwind.sky[500]}
                            margin="$1"
                        />
                    </Pressable>
                );
            }
            colorGrid.push(
                <HStack key={`row-${row}`} space="xs" justifyContent="center">
                    {rowColors}
                </HStack>
            );
        }
        return colorGrid;
    };

    return (
        <>
            <Actionsheet isOpen={isOpen} onClose={handleClose}>
                <ActionsheetBackdrop />
                <ActionsheetContent {...contentProps} bgColor={colors.background.primary}>
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    {items
                        .filter(item => {
                            if (item.key === "labelRequired" || item.key === "showChuThich") {
                                const showLabelItem = items.find(i => i.key === "label");
                                return showLabelItem ? showLabelItem.isSelected : false;
                            }
                            return true;
                        })
                        .map((item) => (
                            <ActionsheetItem
                                key={item.key}
                                isDisabled={item.isDisabled}
                            >
                                <Box w="$full" p="$1" flexDirection="row" alignItems="center">
                                    <Switch
                                        trackColor={{ false: colors.tailwind.neutral[300], true: colors.tailwind.neutral[600] }}
                                        thumbColor={colors.tailwind.neutral[50]}
                                        ios_backgroundColor={colors.tailwind.neutral[300]}
                                        value={item.isSelected}
                                        onValueChange={item.onPress}
                                    />
                                    <ActionsheetItemText color={colors.text.primary} ml="$2">
                                        {item.label}
                                    </ActionsheetItemText>

                                    {(item.showValue && item.isSelected) && (
                                        <TouchableOpacity style={{ flex: 1, flexDirection: "row", alignItems: "center", marginRight: 20 }} onPress={() => handleOpenDialog(item)}>
                                            <Text color={colors.text.primary} ml="$2" w="$full" numberOfLines={1} ellipsizeMode="tail">
                                                {item.value ? item.value.toString() : ""}
                                            </Text>
                                            <Icon as={ChevronRight} size={"xl"} color={colors.tailwind.blue[500]} />
                                        </TouchableOpacity>
                                    )}

                                    {(item.isShowIcon && item.isSelected) && (
                                        <>
                                            <TouchableOpacity onPress={() => { item.onIconPress && item.onIconPress(item) }} style={{ flex: 1, flexDirection: "row", alignItems: "center", marginRight: 20 }}>
                                                <Box ml="$2" w={32} h={32} bg={colors.tailwind.blue[50]} p="$1" borderRadius="$full" alignItems='center'>
                                                    <Icon as={item.icon} size={"xl"} color={colors.tailwind.blue[500]} />
                                                </Box>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleOpenColorDialog(item)} style={{ flex: 1, flexDirection: "row", alignItems: "center", marginRight: 20 }}>
                                                <Box ml="$2" w={32} bg={item.colorIcon} h={32} p="$1" borderRadius="$full" alignItems='center'>
                                                </Box>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </Box>
                            </ActionsheetItem>
                        ))}
                </ActionsheetContent>
            </Actionsheet>

            <AlertDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                closeOnOverlayClick={false}
            >
                <AlertDialogContent w="90%" p="$4" alignItems="center">
                    <AlertDialogBody>
                        <Box w="100%" flexDirection="row" alignItems="center" justifyContent="center">
                            <Input
                                w={"100%"}
                                variant="outline"
                                size="md"
                                isDisabled={false}
                                isInvalid={false}
                                isReadOnly={false}
                            >
                                <InputField
                                    placeholder="Nhập nội dung..."
                                    defaultValue={valueInput}
                                    onChange={(event) => setValueInput(event.nativeEvent.text)}
                                />
                            </Input>
                        </Box>
                    </AlertDialogBody>

                    <AlertDialogFooter mt="$1" flexDirection="row">
                        <Button
                            size="sm"
                            variant="outline"
                            action="secondary"
                            px="$6"
                            flex={1}
                            justifyContent="center"
                            onPress={() => setIsDialogOpen(false)}
                        >
                            <ButtonText textAlign="center">Huỷ</ButtonText>
                        </Button>

                        <Button
                            size="sm"
                            action={"positive"}
                            px="$6"
                            flex={1}
                            ml="$3"
                            justifyContent="center"
                            onPress={handleConfirm}
                        >
                            <ButtonText textAlign="center">Xác nhận</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                isOpen={isDialogColorOpen}
                onClose={() => setIsDialogColorOpen(false)}
                closeOnOverlayClick={false}
            >
                <AlertDialogContent w="96%" p="$4" alignItems="center" bg="#1C1C1E">
                    <AlertDialogBody bg="#1C1C1E" w="$full">
                        <VStack space="md" alignItems="center" p="$2">
                            {renderColorGrid()}
                        </VStack>
                    </AlertDialogBody>

                    <AlertDialogFooter mt="$1" flexDirection="row">
                        <Button
                            size="sm"
                            variant="outline"
                            action="secondary"
                            px="$6"
                            flex={1}
                            justifyContent="center"
                            onPress={() => setIsDialogColorOpen(false)}
                        >
                            <ButtonText textAlign="center" color='white'>Huỷ</ButtonText>
                        </Button>

                        <Button
                            size="sm"
                            action={"positive"}
                            px="$6"
                            flex={1}
                            ml="$3"
                            justifyContent="center"
                            onPress={handleConfirm}
                        >
                            <ButtonText textAlign="center">Xác nhận</ButtonText>
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ActionsheetItemSetting;