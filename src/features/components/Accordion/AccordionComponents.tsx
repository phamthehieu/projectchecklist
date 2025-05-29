import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionTitleText,
    AccordionIcon,
    AccordionContent,
    AccordionContentText,
    Divider,
} from "@gluestack-ui/themed";
import { useAppColorMode } from '../ColorModeContext'; // Import hook để lấy trạng thái color mode (light/dark)
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react-native"; // Import icon mũi tên lên/xuống từ lucide
import { useAppColors } from '../../../hooks/useAppColors';

// Định nghĩa interface cho từng item trong accordion
interface AccordionItemData {
    id: string; // ID duy nhất cho mỗi item
    title: string; // Tiêu đề hiển thị của item
    content: string; // Nội dung chi tiết khi mở rộng item
}

// Định nghĩa props cho component
interface CommonAccordionProps {
    items: AccordionItemData[]; // Mảng các item accordion
    size?: "sm" | "md" | "lg"; // Kích thước của accordion (nhỏ, vừa, lớn)
    variant?: "filled" | "unfilled"; // Kiểu hiển thị (có nền hoặc không)
    isCollapsible?: boolean; // Có thể thu gọn được hay không
    isDisabled?: boolean; // Có bị vô hiệu hóa hay không
    width?: any; // Chiều rộng của accordion
    margin?: any; // Khoảng cách ngoài
    borderRadius?: number; // Độ bo góc của accordion
}

// Component Accordion dùng chung trong toàn dự án
const AccordionComponents: React.FC<CommonAccordionProps> = ({
    items, // Dữ liệu các item accordion
    size = "md", // Giá trị mặc định: kích thước vừa
    variant = "filled", // Giá trị mặc định: có nền
    isCollapsible = true, // Giá trị mặc định: có thể thu gọn
    isDisabled = false, // Giá trị mặc định: không vô hiệu hóa
    width = "90%", // Giá trị mặc định: chiều rộng 90%
    margin = "$5", // Giá trị mặc định: margin 5 đơn vị (theo scale của gluestack)
    borderRadius = 20, // Giá trị mặc định: bo góc 20px
}) => {
    const colors = useAppColors();
    return (
        // Component Accordion chính
        <Accordion
            size={size} // Kích thước của accordion
            variant={variant} // Kiểu hiển thị
            type="single" // Chỉ cho phép mở một item tại một thời điểm
            isCollapsible={isCollapsible} // Có thể thu gọn hay không
            isDisabled={isDisabled} // Có bị vô hiệu hóa hay không
            m={margin} // Margin xung quanh
            w={width} // Chiều rộng
        >
            {/* Lặp qua mảng items để tạo các AccordionItem */}
            {items.map((item, index) => (
                // React.Fragment để nhóm AccordionItem và Divider mà không tạo thêm DOM node
                <React.Fragment key={item.id}>
                    {/* Một item trong accordion */}
                    <AccordionItem
                        value={item.id} // Giá trị duy nhất để xác định item
                        bgColor={colors.background.primary} // Màu nền dựa trên color mode
                    >
                        {/* Phần header của item */}
                        <AccordionHeader>
                            {/* Trigger để mở/đóng item */}
                            <AccordionTrigger>
                                {({ isExpanded }) => ( // isExpanded: trạng thái mở/đóng của item
                                    <>
                                        {/* Tiêu đề của item */}
                                        <AccordionTitleText color={colors.text.primary}>
                                            {item.title}
                                        </AccordionTitleText>
                                        {/* Icon thay đổi dựa trên trạng thái mở/đóng */}
                                        {isExpanded ? (
                                            <AccordionIcon
                                                as={ChevronUpIcon} // Icon mũi tên lên khi mở
                                                ml="$3" // Margin trái 3 đơn vị
                                                color={colors.text.primary} // Màu icon theo color mode
                                            />
                                        ) : (
                                            <AccordionIcon
                                                as={ChevronDownIcon} // Icon mũi tên xuống khi đóng
                                                ml="$3" // Margin trái 3 đơn vị
                                                color={colors.text.primary} // Màu icon theo color mode
                                            />
                                        )}
                                    </>
                                )}
                            </AccordionTrigger>
                        </AccordionHeader>
                        {/* Nội dung hiển thị khi item được mở */}
                        <AccordionContent>
                            <AccordionContentText color={colors.text.primary}>
                                {item.content}
                            </AccordionContentText>
                        </AccordionContent>
                    </AccordionItem>
                    {/* Thêm Divider giữa các item, trừ item cuối cùng */}
                    {index < items.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </Accordion>
    );
};

// Định nghĩa các giá trị mặc định cho props
AccordionComponents.defaultProps = {
    size: "md", // Kích thước mặc định
    variant: "filled", // Kiểu hiển thị mặc định
    isCollapsible: true, // Có thể thu gọn mặc định
    isDisabled: false, // Không vô hiệu hóa mặc định
    width: "90%", // Chiều rộng mặc định
    margin: "$5", // Margin mặc định
    borderRadius: 20, // Độ bo góc mặc định
};

export default AccordionComponents; // Xuất component để dùng trong dự án