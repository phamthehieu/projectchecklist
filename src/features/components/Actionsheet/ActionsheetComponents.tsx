import React from 'react';
import { Actionsheet, ActionsheetContent, ActionsheetItem, ActionsheetItemText, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetBackdrop, Box, ButtonText } from "@gluestack-ui/themed";
import { useAppColorMode } from '../ColorModeContext';
import { useAppColors } from '../../../hooks/useAppColors';
// Định nghĩa interface cho mỗi mục trong Actionsheet
interface ActionItem {
    key: string; // Khóa duy nhất cho mỗi mục
    label: string; // Nhãn hiển thị của mục
    isDisabled?: boolean; // Trạng thái vô hiệu hóa (tùy chọn)
    onPress?: () => void; // Callback khi nhấn vào mục (tùy chọn)
    view?: React.ReactNode;
}

// Định nghĩa interface cho props của ActionsheetComponent
interface ActionsheetComponentProps {
    triggerLabel?: string; // Nhãn của nút trigger
    items: ActionItem[]; // Danh sách các mục trong actionsheet
    isOpen?: boolean; // Trạng thái mở của actionsheet (kiểm soát từ ngoài)
    onOpen?: () => void; // Callback khi actionsheet mở
    onClose?: () => void; // Callback khi actionsheet đóng
    showDragIndicator?: boolean; // Hiển thị thanh kéo hay không
    triggerProps?: object; // Props tùy chỉnh cho nút trigger
    contentProps?: object; // Props tùy chỉnh cho nội dung actionsheet
}

// Component ActionsheetComponent dùng chung cho React Native
const ActionsheetComponent: React.FC<ActionsheetComponentProps> = ({
    items = [], // Danh sách mục mặc định là rỗng
    isOpen: controlledIsOpen, // Trạng thái mở từ ngoài (nếu có)
    onOpen,
    onClose,
    contentProps = {}, // Props tùy chỉnh cho nội dung
}) => {
    // Quản lý trạng thái nội bộ nếu không có isOpen từ ngoài
    const [internalIsOpen, setInternalIsOpen] = React.useState(false);

    // Sử dụng trạng thái từ ngoài nếu có, nếu không dùng trạng thái nội bộ
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    // Hàm xử lý mở actionsheet
    const handleOpen = () => {
        setInternalIsOpen(true);
        if (onOpen) onOpen(); // Gọi callback nếu có
    };

    // Hàm xử lý đóng actionsheet
    const handleClose = () => {
        setInternalIsOpen(false);
        if (onClose) onClose(); // Gọi callback nếu có
    };

    const colors = useAppColors();

    return (
        <>
            {/* Component Actionsheet chính */}
            <Actionsheet isOpen={isOpen} onClose={handleClose}>
                {/* Lớp nền mờ phía sau */}
                <ActionsheetBackdrop />

                {/* Nội dung của actionsheet */}
                <ActionsheetContent {...contentProps} bgColor={colors.background.primary}>
                    {/* Thanh kéo (nếu được bật) */}
                    <ActionsheetDragIndicatorWrapper >
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    {/* Danh sách các mục */}
                    {items.map((item) => (
                        <ActionsheetItem
                            key={item.key}
                            onPress={() => {
                                if (item.onPress) item.onPress();
                                if (!item.view) handleClose(); // Nếu có view, không tự động đóng
                            }}
                            isDisabled={item.isDisabled}
                        >
                            <Box w="$full" p="$1" flexDirection="column">
                                <ActionsheetItemText color={colors.text.primary} mb="$2">{item.label}</ActionsheetItemText>
                                {item.view}
                            </Box>
                        </ActionsheetItem>
                    ))}


                </ActionsheetContent>
            </Actionsheet>
        </>
    );
};

export default ActionsheetComponent;