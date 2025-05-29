import { Popover, Button, ButtonText, PopoverBackdrop, PopoverContent, PopoverBody, Text } from '@gluestack-ui/themed';
import React from 'react';
import { AArrowDown } from "lucide-react-native";

// Định nghĩa interface cho props của PopoverComponent
interface PopoverComponentProps {
    triggerLabel?: string; // Nhãn của nút trigger
    contentText?: string; // Nội dung hiển thị trong popover
    isOpen?: boolean; // Trạng thái mở của popover (kiểm soát từ ngoài)
    placement?: "top" | "bottom" | "left" | "right" | "top left" | "top right" | "bottom left" | "bottom right"; // Vị trí popover
    size?: "sm" | "md" | "lg"; // Kích thước của popover
    textSize?: "xs" | "sm" | "md" | "lg" | "xl"; // Kích thước chữ trong popover
    showArrow?: boolean; // Hiển thị mũi tên hay không
    onOpen?: () => void; // Callback khi popover mở
    onClose?: () => void; // Callback khi popover đóng
    triggerProps?: object; // Props tùy chỉnh cho nút trigger
    contentProps?: object; // Props tùy chỉnh cho nội dung popover
}

// Component PopoverComponent dùng chung cho toàn dự án
const PopoverComponent: React.FC<PopoverComponentProps> = ({
    triggerLabel = "Open Popover", // Nhãn mặc định
    contentText = "This is a reusable popover!", // Nội dung mặc định
    isOpen: controlledIsOpen, // Trạng thái mở từ ngoài (nếu có)
    placement = "top", // Vị trí mặc định
    size = "md", // Kích thước mặc định
    textSize = "md", // Kích thước chữ mặc định
    showArrow = true, // Mặc định hiển thị mũi tên
    onOpen,
    onClose,
    triggerProps = {}, // Props tùy chỉnh cho nút trigger
    contentProps = {}, // Props tùy chỉnh cho nội dung
}) => {
    // Quản lý trạng thái nội bộ nếu không có isOpen từ ngoài
    const [internalIsOpen, setInternalIsOpen] = React.useState(false);

    // Sử dụng trạng thái từ ngoài nếu có, nếu không dùng trạng thái nội bộ
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    // Hàm xử lý mở popover
    const handleOpen = () => {
        setInternalIsOpen(true);
        if (onOpen) onOpen(); // Gọi callback nếu có
    };

    // Hàm xử lý đóng popover
    const handleClose = () => {
        setInternalIsOpen(false);
        if (onClose) onClose(); // Gọi callback nếu có
    };

    return (
        // Component Popover chính
        <Popover
            isOpen={isOpen} // Trạng thái mở
            onClose={handleClose} // Sự kiện đóng
            onOpen={handleOpen} // Sự kiện mở
            placement={placement} // Vị trí
            size={size} // Kích thước
            trigger={(triggerPropsFromPopover: any) => (
                // Nút trigger để mở popover
                <Button
                    {...triggerPropsFromPopover} // Props từ Popover
                    {...triggerProps} // Props tùy chỉnh từ người dùng
                >
                    <ButtonText>{triggerLabel}</ButtonText>
                </Button>
            )}
        >
            {/* Lớp nền mờ phía sau */}
            <PopoverBackdrop />

            {/* Nội dung của popover */}
            <PopoverContent {...contentProps}>
                {/* Mũi tên (nếu được bật) */}
                {showArrow && <AArrowDown />}

                {/* Phần thân nội dung */}
                <PopoverBody>
                    <Text size={textSize} >
                        {contentText}
                    </Text>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default PopoverComponent;