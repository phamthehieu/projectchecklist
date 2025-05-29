import { Table, Row } from 'react-native-table-component'; // Import Table và Row từ thư viện react-native-table-component
import React, { useEffect, useState } from 'react'; // Import React và các hook useEffect, useState
import { ScrollView, StyleSheet, View, Text as RNText, PixelRatio } from 'react-native'; // Import các component cơ bản từ React Native
import { Text } from '@gluestack-ui/themed'; // Import component Text từ Gluestack UI
import { useAppColorMode } from '../ColorModeContext'; // Hook để lấy trạng thái chế độ màu (sáng/tối)

// Định nghĩa interface cho props của component TableComponents
interface IProps {
    dataTable: any[]; // Dữ liệu bảng, mảng các hàng
    tableHead: string[]; // Tiêu đề cột của bảng
    mapRowToDisplayData?: (row: any, index: number) => any[]; // Hàm tùy chỉnh để ánh xạ dữ liệu hàng thành mảng hiển thị
    minColumnWidth?: number; // Chiều rộng tối thiểu của cột
    maxColumnWidth?: number; // Chiều rộng tối đa của cột
    paddingHorizontal?: number; // Padding ngang cho mỗi ô
}

// Component TableComponents: Hiển thị bảng với hỗ trợ chế độ sáng/tối và chiều rộng cột động
const TableComponents: React.FC<IProps> = ({
    dataTable,
    tableHead,
    mapRowToDisplayData = (row, index) => {
        // Hàm mặc định để ánh xạ dữ liệu hàng
        if (Array.isArray(row)) {
            return row; // Nếu row đã là mảng, trả về nguyên bản
        }
        // Nếu row là object, trả về mảng với số thứ tự và các giá trị
        return [index + 1, ...Object.values(row)];
    },
    minColumnWidth = 80, // Chiều rộng tối thiểu mặc định
    maxColumnWidth = 300, // Chiều rộng tối đa mặc định
    paddingHorizontal = 16, // Padding ngang mặc định
}) => {
    // State để lưu trữ chiều rộng của từng cột
    const [columnWidths, setColumnWidths] = useState<number[]>([]);
    // Lấy trạng thái chế độ màu (sáng/tối) từ context
    const { colorMode } = useAppColorMode();

    // Hàm tính toán chiều rộng của ô dựa trên nội dung văn bản
    const calculateTextWidth = (text: string): number => {
        // Tính chiều rộng ký tự dựa trên tỷ lệ font
        const charWidth = 8 * PixelRatio.getFontScale();
        const textStr = String(text || ''); // Chuyển đổi text thành chuỗi

        // Tính chiều rộng, giới hạn giữa minColumnWidth và maxColumnWidth
        const width = Math.min(
            maxColumnWidth,
            Math.max(minColumnWidth, textStr.length * charWidth + paddingHorizontal * 2)
        );

        return width;
    };

    // useEffect để tính toán chiều rộng cột khi dữ liệu thay đổi
    useEffect(() => {
        // Kiểm tra nếu không có dữ liệu hoặc tiêu đề, thoát khỏi effect
        if (dataTable.length === 0 || !tableHead || tableHead.length === 0) {
            return;
        }

        // Tính chiều rộng ban đầu dựa trên tiêu đề
        const widths = tableHead.map(header => calculateTextWidth(header));

        // Duyệt qua từng hàng dữ liệu để cập nhật chiều rộng cột
        dataTable.forEach((row, rowIndex) => {
            const rowData = mapRowToDisplayData(row, rowIndex); // Ánh xạ dữ liệu hàng
            rowData.forEach((cellData, colIndex) => {
                // Chỉ cập nhật nếu cột tồn tại trong widths
                if (colIndex < widths.length) {
                    const cellWidth = calculateTextWidth(cellData); // Tính chiều rộng ô
                    widths[colIndex] = Math.max(widths[colIndex], cellWidth); // Cập nhật chiều rộng lớn nhất
                }
            });
        });

        // Lưu trữ chiều rộng cột vào state
        setColumnWidths(widths);
    }, [dataTable, tableHead, minColumnWidth, maxColumnWidth, paddingHorizontal]); // Dependencies của effect

    return (
        <>
            {/* Kiểm tra nếu có dữ liệu và chiều rộng cột đã được tính toán */}
            {dataTable.length > 0 && columnWidths.length > 0 ? (
                // ScrollView ngang để hỗ trợ bảng rộng
                <ScrollView horizontal style={{ marginTop: 20 }}>
                    <View>
                        {/* Hiển thị tiêu đề bảng */}
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                            <Row
                                data={tableHead} // Dữ liệu tiêu đề
                                widthArr={columnWidths} // Chiều rộng cột
                                style={styles.header} // Style cho hàng tiêu đề
                                textStyle={{
                                    color: colorMode === "dark" ? "white" : "black",
                                    textAlign: 'center',
                                    fontWeight: '300'
                                }} // Style văn bản, thay đổi màu theo chế độ
                            />
                        </Table>
                        {/* ScrollView dọc để hiển thị nội dung bảng */}
                        <ScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                                {/* Duyệt qua từng hàng dữ liệu */}
                                {dataTable.map((rowData, index) => (
                                    <Row
                                        key={index} // Key duy nhất cho mỗi hàng
                                        data={mapRowToDisplayData(rowData, index)} // Dữ liệu hàng đã ánh xạ
                                        widthArr={columnWidths} // Chiều rộng cột
                                        style={[styles.rowStyle, {
                                            backgroundColor: colorMode === "dark" ? "black" : "white"
                                        }]} // Style hàng, thay đổi màu nền theo chế độ
                                        textStyle={{
                                            color: colorMode === "dark" ? "white" : "black",
                                            textAlign: 'center',
                                            fontWeight: '300'
                                        }} // Style văn bản, thay đổi màu theo chế độ
                                    />
                                ))}
                            </Table>
                        </ScrollView>
                    </View>
                </ScrollView>
            ) : (
                // Hiển thị thông báo nếu không có dữ liệu
                <Text>Không có data</Text>
            )}
        </>
    );
};

export default TableComponents;

// Định nghĩa các style sử dụng StyleSheet
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        marginTop: 10,
    },
    button: {
        width: 100,
    },
    searchButtonContainer: {
        marginTop: 10,
    },
    header: {
        height: 50,
        backgroundColor: '#1C92FF' // Màu nền cho hàng tiêu đề
    },
    dataWrapper: {
        marginTop: -1 // Điều chỉnh margin để loại bỏ khoảng cách không mong muốn
    },
    rowStyle: {
        height: 40,
        backgroundColor: 'white' // Màu nền mặc định cho hàng (sẽ bị ghi đè bởi chế độ màu)
    }
});