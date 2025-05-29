import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionTrigger,
    AccordionTitleText,
    AccordionContentText,
    AccordionIcon,
    AccordionContent
} from "@gluestack-ui/themed"; // Import các component từ gluestack-ui/themed để xây dựng giao diện accordion
import { MinusIcon, PlusIcon } from "lucide-react-native"; // Import icon dấu trừ và dấu cộng từ lucide-react-native
import { useAppColorMode } from '../ColorModeContext'; // Import hook để lấy trạng thái chế độ màu (light/dark) từ context
import { useAppColors } from '../../../hooks/useAppColors';

// Định nghĩa interface cho mỗi item trong accordion
interface AccordionItemData {
    id: string; // ID duy nhất để phân biệt từng item
    title: string; // Tiêu đề của item, hiển thị trong header
    content: string; // Nội dung chi tiết, hiển thị khi item được mở rộng
}

// Định nghĩa props cho component
interface CommonAccordionProps {
    items: AccordionItemData[]; // Mảng chứa các item accordion
    width?: any; // Chiều rộng của accordion, có thể là string (ví dụ: "$80") hoặc number
    maxWidth?: any; // Chiều rộng tối đa của accordion
    margin?: any; // Khoảng cách ngoài của accordion
    itemSpacing?: any; // Khoảng cách giữa các item trong accordion
    borderRadius?: any; // Độ bo góc của mỗi item
}

// Component Accordion dùng chung cho React Native
const CommonAccordion: React.FC<CommonAccordionProps> = ({
    items, // Dữ liệu các item accordion
    width = "$80", // Giá trị mặc định: 80% chiều rộng (theo scale của gluestack-ui)
    maxWidth = 640, // Giá trị mặc định: chiều rộng tối đa 640px
    margin = "$5", // Giá trị mặc định: margin 5 đơn vị
    itemSpacing = "$5", // Giá trị mặc định: khoảng cách giữa các item 5 đơn vị
    borderRadius = 8, // Giá trị mặc định: bo góc 8px
}) => {
    const colors = useAppColors();
    return (
        // Component Accordion chính bao quanh các item
        <Accordion
            width={width} // Thiết lập chiều rộng
            maxWidth={maxWidth} // Thiết lập chiều rộng tối đa
            m={margin} // Thiết lập margin xung quanh
            bgColor='transparent' // Màu nền trong suốt cho accordion chính
        >
            {/* Lặp qua mảng items để tạo các AccordionItem */}
            {items.map((item, index) => (
                // Mỗi item trong accordion
                <AccordionItem
                    key={item.id} // Key duy nhất để React quản lý danh sách
                    value={item.id} // Giá trị duy nhất để xác định item khi mở/đóng
                    borderRadius={borderRadius} // Độ bo góc của item
                    mt={index > 0 && itemSpacing} // Margin top cho các item từ thứ 2 trở đi (không áp dụng cho item đầu)
                    bgColor={colors.background.primary} // Màu nền của item theo chế độ màu
                >
                    {/* Phần header của item */}
                    <AccordionHeader>
                        {/* Trigger để mở/đóng item */}
                        <AccordionTrigger>
                            {({ isExpanded }) => ( // isExpanded: trạng thái mở/đóng của item
                                <>
                                    {/* Icon thay đổi dựa trên trạng thái mở/đóng */}
                                    {isExpanded ? (
                                        <AccordionIcon
                                            as={MinusIcon} // Icon dấu trừ khi item mở
                                            mr="$3" // Margin phải 3 đơn vị
                                            color={colors.text.primary} // Màu icon theo chế độ màu
                                        />
                                    ) : (
                                        <AccordionIcon
                                            as={PlusIcon} // Icon dấu cộng khi item đóng
                                            mr="$3" // Margin phải 3 đơn vị
                                            color={colors.text.primary} // Màu icon theo chế độ màu
                                        />
                                    )}
                                    {/* Tiêu đề của item */}
                                    <AccordionTitleText color={colors.text.primary}>
                                        {item.title}
                                    </AccordionTitleText>
                                </>
                            )}
                        </AccordionTrigger>
                    </AccordionHeader>
                    {/* Nội dung hiển thị khi item được mở */}
                    <AccordionContent ml="$9"> {/* Margin trái 9 đơn vị để thụt đầu dòng */}
                        <AccordionContentText color={colors.text.primary}>
                            {item.content}
                        </AccordionContentText>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

// Định nghĩa các giá trị mặc định cho props
CommonAccordion.defaultProps = {
    width: "$80", // Chiều rộng mặc định: 80%
    maxWidth: 640, // Chiều rộng tối đa mặc định: 640px
    margin: "$5", // Margin mặc định: 5 đơn vị
    itemSpacing: "$5", // Khoảng cách giữa các item mặc định: 5 đơn vị
    borderRadius: 8, // Độ bo góc mặc định: 8px
};

export default CommonAccordion; // Xuất component để sử dụng trong toàn dự án