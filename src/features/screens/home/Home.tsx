// import React, { useState } from "react";
// import { Box, ScrollView, Text, Icon, set } from "@gluestack-ui/themed";
// import { useAppColorMode } from "../../components/ColorModeContext";
// import { Bolt, CheckIcon, CirclePlus, Copy, Expand, Pencil, Trash2 } from "lucide-react-native";
// import MHeader from "../../components/header/MHeader";
// import { TouchableOpacity, View } from "react-native";
// import colors from "tailwindcss/colors";
// import ActionsheetComponent from "../../components/Actionsheet/ActionsheetComponents";
// import AppTextField from "../../components/Input/MTextField";
// import SelectComponent from "../../components/Select/SelectComponents";
// import TextareaComponent from "../../components/Textarea/TextareaComponents";
// import uuid from 'react-native-uuid';
// import ActionsheetItemSetting from "../../components/Actionsheet/ActionsheetItemSetting";

// const InputSelect: any = {
//     view: "input",
//     option: {
//         secure: false,
//         showLabel: false,
//         label: '',
//         chuthich: '',
//         leftIcon: Pencil,
//         colorIconLeft: colors.blue[500],
//         rightIcon: Pencil,
//         colorIconRight: colors.red[500],
//         multiline: false,
//         keyboardType: "default",
//         returnKeyType: "done",
//         placeholder: "Nhập liệu",
//         value: "",
//         labelRequired: false,
//         upcase: false,
//         showChuThich: false,
//         showiconRight: false,
//         showiconLeft: false
//     }
// }

// const HomeScreens: React.FC = ({ navigation }: any) => {
//     const { colorMode } = useAppColorMode();
//     const isDarkMode = colorMode === "dark";
//     // State để kiểm soát Actionsheet
//     const [isActionsheetOpen, setIsActionsheetOpen] = useState(false);
//     const [listSelect, setListSelect] = useState<any[]>([])

//     const [isOptionSheetOpen, setIsOptionSheetOpen] = useState(false);
//     const [selectedInputIndex, setSelectedInputIndex] = useState<number | null>(null);

//     // Danh sách mục trong Actionsheet
//     const actionItems = [
//         {
//             key: "1",
//             label: "Ô nhập liệu",
//             onPress: () => {
//                 setListSelect((prev = []) => [...prev, { ...InputSelect, key: uuid.v4() }]);
//                 setIsActionsheetOpen(false);
//             },
//             view: <AppTextField readOnly placeholder="Ô nhập nhiệu" leftIcon={<Icon as={Pencil} size={"xl"} color={colors.blue[500]} />} />
//         },
//         {
//             key: "2",
//             label: "Danh sách lựa chọn",
//             onPress: () => console.log("Tải danh sách đơn hàng"),
//             view:
//                 <SelectComponent
//                     selectedValue="gia_tri_1"
//                     placeholder={"Danh sách lựa chọn"}
//                     options={[
//                         { label: "Giá trị 1", value: "gia_tri_1" },
//                         { label: "Giá trị 2", value: "gia_tri_2" },
//                         { label: "Giá trị 3", value: "gia_tri_3" }
//                     ]}
//                 />
//         },
//         {
//             key: "3",
//             label: "nhập liệu nhiều dòng",
//             onPress: () => console.log("Tải danh sách đơn hàng"),
//             view:
//                 <TextareaComponent isReadOnly />
//         },
//     ];

//     console.log(listSelect);

//     return (
//         <View style={{ flex: 1, backgroundColor: colors.gray[800] }}>
//             <MHeader
//                 showiconLeft
//                 onBack={() => console.log("Back")}
//                 label="Tạo mới đơn hàng"
//             />

//             <ScrollView mb={"$12"} w="$full" h="$full">
//                 {listSelect.length > 0 && listSelect.map((item, index) => (
//                     <Box
//                         key={index}
//                         width={"90%"}
//                         marginLeft="5%"
//                         h={"$20"}
//                         marginTop={40}
//                         marginVertical={12}
//                         borderWidth={2}
//                         borderRadius={10}
//                         borderColor={colors.blue[500]}
//                         alignItems="center"
//                         justifyContent="center"
//                         position="relative"
//                     >
//                         {item.view === "input" && (
//                             <Box w="90%">
//                                 <AppTextField
//                                     showLabel={item.option.showLabel}
//                                     secure={item.option.secure}
//                                     label={item.option.label}
//                                     chuthich={item.option.chuthich}
//                                     leftIcon={item.option.leftIcon}
//                                     colorIconLeft={item.option.colorIconLeft}
//                                     rightIcon={item.option.rightIcon}
//                                     colorIconRight={item.option.colorIconRight}
//                                     multiline={item.option.multiline}
//                                     keyboardType={item.option.keyboardType}
//                                     returnKeyType={item.option.returnKeyType}
//                                     placeholder={item.option.placeholder}
//                                     labelRequired={item.option.labelRequired}
//                                     upcase={item.option.upcase}
//                                     showChuThich={item.option.showChuThich}
//                                     showiconRight={item.option.showiconRight}
//                                     showiconLeft={item.option.showiconLeft}
//                                 />
//                             </Box>
//                         )}


//                         <TouchableOpacity
//                             onPress={() => {
//                                 setSelectedInputIndex(index);
//                                 setIsOptionSheetOpen(true);
//                             }}
//                             style={{
//                                 position: "absolute",
//                                 top: -16,
//                                 left: -16,
//                                 backgroundColor: colors.white,
//                                 borderRadius: 20,
//                                 padding: 4,
//                                 borderWidth: 2,
//                                 borderColor: colors.blue[500],
//                             }}
//                         >
//                             <Icon as={Bolt} size="lg" color={colors.blue[500]} />
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             onPress={() => {
//                                 if (selectedInputIndex !== null) {
//                                     setListSelect((prev) => [
//                                         ...prev,
//                                         {
//                                             ...prev[selectedInputIndex],
//                                             key: uuid.v4(),
//                                         },
//                                     ]);
//                                 }
//                             }}
//                             style={{
//                                 position: "absolute",
//                                 top: -16,
//                                 right: -16,
//                                 backgroundColor: colors.white,
//                                 borderRadius: 20,
//                                 padding: 4,
//                                 borderWidth: 2,
//                                 borderColor: colors.blue[500],
//                             }}
//                         >
//                             <Icon as={Copy} size="lg" color={colors.green[500]} />
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             onPress={() => {
//                                 if (selectedInputIndex !== null) {
//                                     setListSelect((prev) => prev.filter((_, i) => i !== selectedInputIndex));
//                                 }
//                             }}
//                             style={{
//                                 position: "absolute",
//                                 bottom: -16,
//                                 right: -16,
//                                 backgroundColor: colors.white,
//                                 borderRadius: 20,
//                                 padding: 4,
//                                 borderWidth: 2,
//                                 borderColor: colors.blue[500],
//                             }}
//                         >
//                             <Icon as={Trash2} size="lg" color={colors.red[500]} />
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             onPress={() => console.log("Xóa")}
//                             style={{
//                                 position: "absolute",
//                                 left: -16,
//                                 bottom: -16,
//                                 backgroundColor: colors.white,
//                                 borderRadius: 20,
//                                 padding: 4,
//                                 borderWidth: 2,
//                                 borderColor: colors.blue[500],
//                             }}
//                         >
//                             <Icon as={Expand} size="lg" color={colors.yellow[500]} />
//                         </TouchableOpacity>
//                     </Box>

//                 ))}
//                 <TouchableOpacity onPress={() => setIsActionsheetOpen(true)} style={{ alignItems: "center", marginTop: 40 }}>
//                     <Box
//                         p={"$4"}
//                         mb={"$32"}
//                         width={"96%"}
//                         h={"$20"}
//                         borderRadius={10}
//                         borderWidth={2}
//                         borderColor={colors.blue[500]}
//                         borderStyle="dashed"
//                         flexDirection="row"
//                         alignItems="center"
//                         justifyContent="center"
//                     >
//                         <Icon as={CirclePlus} size={"xl"} color={colors.blue[500]} />
//                         <Text ml={"$2"} color={colors.blue[500]} fontSize={16}>Thêm mới</Text>
//                     </Box>
//                 </TouchableOpacity>
//             </ScrollView>

//             <ActionsheetComponent
//                 isOpen={isActionsheetOpen}
//                 onClose={() => setIsActionsheetOpen(false)}
//                 items={actionItems}
//             />

//             <ActionsheetItemSetting
//                 isOpen={isOptionSheetOpen}
//                 onClose={() => setIsOptionSheetOpen(false)}
//                 items={[
//                     {
//                         key: "secure",
//                         label: "Bật/Tắt chế độ bảo mật",
//                         isSelected: selectedInputIndex !== null && !!listSelect[selectedInputIndex]?.option.secure, // ✅ Chuyển thành boolean chắc chắn
//                         onPress: () => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, secure: !item.option.secure } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         }
//                     },
//                     {
//                         key: "multiline",
//                         label: "Cho phép nhập nhiều dòng",
//                         isSelected: selectedInputIndex !== null && !!listSelect[selectedInputIndex]?.option.multiline,
//                         onPress: () => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, multiline: !item.option.multiline } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         }
//                     },
//                     {
//                         key: "upcase",
//                         label: "Chuyển thành chữ in hoa",
//                         isSelected: selectedInputIndex !== null && !!listSelect[selectedInputIndex]?.option.upcase, // ✅ Chuyển thành boolean chắc chắn
//                         onPress: () => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, upcase: !item.option.upcase } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         }
//                     },
//                     {
//                         key: "showiconLeft",
//                         label: "Hiển thị icon bên trái",
//                         isSelected: selectedInputIndex !== null && !!listSelect[selectedInputIndex]?.option.showiconLeft,
//                         isShowIcon: true,
//                         icon: selectedInputIndex !== null && listSelect[selectedInputIndex]?.option.leftIcon,
//                         colorIcon: selectedInputIndex !== null && listSelect[selectedInputIndex]?.option.colorIconLeft,
//                         onPress: () => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, showiconLeft: !item.option.showiconLeft } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         },
//                         onColorIconPress: (color?: string) => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, colorIconLeft: color } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         },
//                     },
//                     {
//                         key: "showiconRight",
//                         label: "Hiển thị icon bên phải",
//                         isSelected: selectedInputIndex !== null && !!listSelect[selectedInputIndex]?.option.showiconRight,
//                         isShowIcon: true,
//                         icon: selectedInputIndex !== null && listSelect[selectedInputIndex]?.option.rightIcon,
//                         colorIcon: selectedInputIndex !== null && listSelect[selectedInputIndex]?.option.colorIconRight,
//                         onPress: () => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, showiconRight: !item.option.showiconRight } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         },
//                         onColorIconPress: (color?: string) => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, colorIconRight: color } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         },
//                     },
//                     {
//                         key: "label",
//                         label: "Tên nhãn",
//                         isSelected: selectedInputIndex !== null && listSelect[selectedInputIndex]?.option.showLabel,
//                         showValue: true,
//                         value: selectedInputIndex !== null && listSelect[selectedInputIndex]?.option.label,
//                         onPress: () => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, showLabel: !item.option.showLabel } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         },
//                         onValue: (value: string) => {
//                             if (selectedInputIndex !== null) {
//                                 setListSelect((prev) =>
//                                     prev.map((item, index) =>
//                                         index === selectedInputIndex
//                                             ? { ...item, option: { ...item.option, label: value } }
//                                             : item
//                                     )
//                                 );
//                             }
//                         }
//                     },
//                     ...(selectedInputIndex !== null && listSelect[selectedInputIndex]?.option.showLabel
//                         ? [
//                             {
//                                 key: "labelRequired",
//                                 label: "Bật/Tắt trường bắt buộc",
//                                 isSelected: !!listSelect[selectedInputIndex]?.option.labelRequired,
//                                 onPress: () => {
//                                     if (selectedInputIndex !== null) {
//                                         setListSelect((prev) =>
//                                             prev.map((item, index) =>
//                                                 index === selectedInputIndex
//                                                     ? { ...item, option: { ...item.option, labelRequired: !item.option.labelRequired } }
//                                                     : item
//                                             )
//                                         );
//                                     }
//                                 }
//                             },
//                             {
//                                 key: "showChuThich",
//                                 label: "Hiển thị chú thích",
//                                 isSelected: !!listSelect[selectedInputIndex]?.option.showChuThich,
//                                 value: listSelect[selectedInputIndex]?.option.chuthich,
//                                 showValue: true,
//                                 onPress: () => {
//                                     if (selectedInputIndex !== null) {
//                                         setListSelect((prev) =>
//                                             prev.map((item, index) =>
//                                                 index === selectedInputIndex
//                                                     ? { ...item, option: { ...item.option, showChuThich: !item.option.showChuThich } }
//                                                     : item
//                                             )
//                                         );
//                                     }
//                                 },
//                                 onValue: (value: string) => {
//                                     if (selectedInputIndex !== null) {
//                                         setListSelect((prev) =>
//                                             prev.map((item, index) =>
//                                                 index === selectedInputIndex
//                                                     ? { ...item, option: { ...item.option, chuthich: value } }
//                                                     : item
//                                             )
//                                         );
//                                     }
//                                 }
//                             }
//                         ]
//                         : []),
//                 ]}
//             />

//         </View>
//     );
// };

// export default HomeScreens;
