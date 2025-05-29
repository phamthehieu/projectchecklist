import React from 'react';
import { Menu, MenuItem, MenuItemLabel, Button, ButtonText, Icon } from '@gluestack-ui/themed'; // Nhập các component từ gluestack-ui
import { useAppColorMode } from '../ColorModeContext'; // Hook để lấy chế độ màu (dark/light)
import { useAppColors } from '../../../hooks/useAppColors';

// Định nghĩa interface MenuItemProps cho từng mục trong menu
interface MenuItemProps {
    key: string; // Khóa duy nhất cho mỗi mục
    label: string; // Nhãn hiển thị của mục
    icon?: any; // Icon tùy chọn cho mục (có thể là component hoặc biểu tượng)
    color?: string; // Màu sắc cho mục
}

// Định nghĩa interface MenuComponentProps cho toàn bộ component MenuComponent
interface MenuComponentProps {
    placement?: "bottom" | "top" | "right" | "left" | "top left" | "top right" | "bottom left" | "bottom right" | "right top" | "right bottom" | "left top" | "left bottom"; // Vị trí hiển thị menu
    items: MenuItemProps[]; // Danh sách các mục menu (động)
    disabledKeys?: string[]; // Danh sách các key của mục bị vô hiệu hóa
    triggerLabel?: string; // Nhãn của nút kích hoạt menu
    onSelect?: (key: string) => void; // Callback khi chọn một mục trong menu
    defaultIsOpen?: boolean; // Trạng thái mở mặc định của menu
    isOpen?: boolean; // Trạng thái mở menu (kiểm soát từ bên ngoài)
    onOpen?: () => void; // Callback khi menu mở
    onClose?: () => void; // Callback khi menu đóng
    offset?: number; // Khoảng cách từ nút trigger đến menu
    crossOffset?: number; // Khoảng cách theo trục chéo (cross-axis)
    closeOnSelect?: boolean; // Menu tự đóng sau khi chọn mục hay không
    selectedKeys?: 'all' | Set<string>; // Các key được chọn (hỗ trợ chọn nhiều)
    selectionMode?: 'none' | 'single' | 'multiple'; // Chế độ chọn: không chọn, chọn một, hoặc chọn nhiều
    trigger?: (props: any, state: { open: boolean }) => React.ReactElement; // Thêm dòng này
}

// Component MenuComponent là một menu thả xuống tùy chỉnh
const MenuComponent: React.FC<MenuComponentProps> = ({
    placement = "bottom", // Mặc định menu hiển thị phía dưới
    items,
    disabledKeys = [], // Mặc định không có mục nào bị vô hiệu hóa
    triggerLabel = "Menu", // Nhãn mặc định cho nút trigger
    onSelect,
    defaultIsOpen = false, // Mặc định menu không mở
    isOpen,
    onOpen,
    onClose,
    offset,
    crossOffset,
    closeOnSelect = true, // Mặc định đóng menu sau khi chọn
    selectedKeys,
    selectionMode,
    trigger,
}) => {
    const colors = useAppColors();
    const borderColor = colors.tailwind.gray[300]; // Màu viền

    return (
        // Component Menu bao bọc toàn bộ menu thả xuống
        <Menu
            placement={placement} // Vị trí hiển thị menu
            bgColor={colors.background.primary} // Áp dụng màu nền theo chế độ màu
            offset={offset} // Khoảng cách từ trigger
            crossOffset={crossOffset} // Khoảng cách trục chéo
            defaultIsOpen={defaultIsOpen} // Trạng thái mở mặc định
            isOpen={isOpen} // Trạng thái mở (kiểm soát từ ngoài)
            onOpen={onOpen} // Callback khi mở
            onClose={onClose} // Callback khi đóng
            closeOnSelect={closeOnSelect} // Tự đóng khi chọn
            disabledKeys={disabledKeys} // Các mục bị vô hiệu hóa
            selectedKeys={selectedKeys} // Các mục được chọn
            selectionMode={selectionMode} // Chế độ chọn
            // Nút trigger để mở menu
            trigger={
                trigger
                    ? (props, state) => trigger(props, state)
                    : (props, state) => (
                        <Button
                            {...props}
                            bgColor={colors.background.primary}
                            borderColor={borderColor}
                            borderWidth={1}
                        >
                            <ButtonText color={colors.text.primary}>{triggerLabel}</ButtonText>
                        </Button>
                    )
            }
        >
            {/* Hiển thị danh sách các mục trong menu */}
            {items.map((item) => (
                <MenuItem
                    key={item.key} // Khóa duy nhất cho mỗi mục
                    textValue={item.label} // Giá trị văn bản của mục
                    onPress={() => onSelect?.(item.key)} // Gọi callback khi chọn mục
                    bgColor={colors.background.primary} // Màu nền mục theo chế độ màu
                    borderBottomWidth={1} // Viền dưới để phân cách các mục
                    borderColor={borderColor}
                >
                    {/* Hiển thị icon nếu có */}
                    {item.icon && (
                        <Icon
                            as={item.icon}
                            size="sm"
                            marginRight="$2" // Khoảng cách giữa icon và nhãn
                            color={colors.text.primary} // Màu icon theo chế độ
                        />
                    )}
                    {/* Nhãn của mục */}
                    <MenuItemLabel size="sm" color={colors.text.primary}>
                        {item.label}
                    </MenuItemLabel>
                </MenuItem>
            ))}
        </Menu>
    );
};

export default MenuComponent; // Xuất component để sử dụng ở nơi khác