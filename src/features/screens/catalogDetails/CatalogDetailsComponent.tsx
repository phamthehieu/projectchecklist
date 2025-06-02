import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from '@gluestack-ui/themed';
import { useAppColors } from '../../../hooks/useAppColors';
import MHeader from '../../components/header/MHeader';
import MScrollView from '../../components/ScrollView/MScrollView';
import MAlert from '../../components/Alert/MAlert';
import MSpinner from '../../components/Spinner/MSpinner';
import DynamicFieldRenderer from './DynamicFieldRenderer';

const serverFormTemplate = [
    {
        id: "title_section",
        type: 1,
        text: {
            value: "Thông tin kiểm tra",
            color: "#000000",
            fontSize: 20,
            fontWeight: "bold"
        }
    },
    {
        id: "input_example",
        type: 2,
        required: true,
        input: {
            label: "Nhập giá trị",
            placeholder: "Nhập...",
            value: "",
            onChangeText: "handleInputExample",
            secureTextEntry: false,
            onRightIconPress: null,
            labelRequired: true,
            containerStyle: {},
            inputStyle: {},
            inputContainerStyle: {},
            leftIcon: null,
            keyboardType: "default",
            onBlur: null,
            onFocus: null,
            readOnly: false,
            rightIcon: null,
            onSubmitEditing: null,
            returnKeyType: "done",
            chuthich: "Nhập thông tin",
            multiline: false,
            upcase: false,
            showLabel: true,
            showChuThich: true,
            showiconLeft: false,
            showiconRight: false,
            colorIconLeft: "#000",
            colorIconRight: "#000",
            maxLength: 100,
            autoCapitalize: "none",
            error: "",
            disabled: false,
            testID: "",
            borderRadius: 8,
            size: "md",
            height: 48
        }
    },
    {
        id: "select_example",
        type: 3,
        required: true,
        select: {
            label: "Chọn loại",
            placeholder: "Chọn...",
            options: [
                { label: "Option 1", value: "opt1" },
                { label: "Option 2", value: "opt2" }
            ],
            selectedValue: "",
            onValueChange: "handleSelectExample",
            showIconLeft: false,
            iconLeft: null,
            labelRequired: true,
            chuthich: "Chọn giá trị",
            readonly: false,
            style: {},
            variant: "outline",
            size: "md",
            heightProps: 48,
            borderRadius: 8
        }
    },
    {
        id: "camera_example",
        type: 4,
        camera: {
            config: {},
            onImagesChange: "handleImagesChange",
            onImageSelect: null,
            onImageEdit: null,
            onImageDelete: null,
            buttonTitle: "Chụp ảnh",
            showButton: true,
            containerStyle: {},
            imageContainerStyle: {},
            maxImages: 5,
            initialImages: [],
            showImageTamplate: true,
        }
    },
    {
        id: "video_example",
        type: 5,
        video: {
            containerStyle: {},
            buttonStyle: {},
            buttonTextStyle: {},
            buttonTitle: "Ghi video",
            showButton: true,
            buttonIcon: null,
            buttonIconSize: 24,
            videoListStyle: {},
            videoItemStyle: {},
            videoThumbnailStyle: {},
            maxVideos: 3,
            onVideoListChange: "handleVideosChange",
            videoRecordingProps: {},
            videoPlayerStyle: {},
            videoPlayerControls: true,
            videoPlayerRepeat: false,
            deleteAlertTitle: "Xóa video",
            deleteAlertMessage: "Bạn có chắc muốn xóa video này?",
            deleteAlertOkText: "Xóa",
            deleteAlertCancelText: "Hủy",
            onVideoAdd: null,
            onVideoDelete: null,
            onVideoSelect: null
        }
    },
    {
        id: "checkbox_example",
        type: 6,
        checkbox: {
            items: [
                { label: "Checkbox 1", value: "cb1" },
                { label: "Checkbox 2", value: "cb2" }
            ],
            value: [],
            onChange: "handleCheckboxChange",
            containerStyle: {},
            checkboxStyle: {},
            labelStyle: {}
        }
    },
    {
        id: "textarea_example",
        type: 7,
        textarea: {
            label: "Ghi chú",
            labelRequired: false,
            size: "md",
            borderRadius: 8,
            placeholder: "Nhập ghi chú...",
            isReadOnly: false,
            value: "",
            onChangeText: "handleTextareaChange",
            textareaInputProps: {},
            template: "",
            templateFields: [],
            onValidationError: null,
            containerStyle: {}
        }
    },
    {
        id: "date_example",
        type: 8,
        dateInput: {
            label: "Ngày kiểm tra",
            placeholder: "Chọn ngày",
            value: "",
            onChangeText: "handleDateChange",
            onBlur: null,
            onRightIconPress: "handleDateChange",
            showRightIcon: true,
            maxLength: 10,
            error: "",
            disabled: false
        }
    },
    {
        id: "switch_example",
        type: 9,
        switchList: {
            title: "Bật tắt",
            items: [
                { label: "Kích hoạt", value: true }
            ],
            onValueChange: "handleSwitchChange"
        }
    },
    {
        id: "button_group",
        type: 10,
        buttons: [
            {
                title: "Gửi",
                type: "add",
                size: "lg",
                variant: "solid",
                action: "primary",
                onPress: "handleSubmit"
            },
            {
                title: "Hủy",
                type: "cancel",
                variant: "secondary",
                size: "lg",
                action: "secondary",
                onPress: "handleCancel",
                isDisabled: false
            }
        ]
    }
];


const fetchServerFormTemplate = () =>
    new Promise<any[]>((resolve) => setTimeout(() => resolve(serverFormTemplate), 400));

const CatalogDetailsComponent = ({ navigation }: any) => {
    const colors = useAppColors();

    const [formTemplate, setFormTemplate] = useState<any[]>([]);

    const [formValues, setFormValues] = useState<any>({});

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const fieldHandlers = {
        handleVoltageChange: (text: string) => handleChange("input_voltage", text),
        handleTemperatureChange: (text: string) => handleChange("input_temperature", text),
        handleDateChange: (text: string) => handleChange("date_check", text),
        handleNoteChange: (text: string) => handleChange("textarea_note", text),
        handleErrorTypeChange: (value: string) => handleChange("select_error_type", value),
        handleErrorTypeChange2: (value: string) => handleChange("select_error_type_2", value),
        handleNumberChange: (text: string) => handleChange("input_number", text),
        handleNumberChange2: (text: string) => handleChange("input_number_2", text),
        handleTextAreaChange: (text: string) => handleTextAreaChange(text),
        handleSubmit: () => handleSubmit(),
        handleCancel: () => handleCancel(),
    };


    useEffect(() => {
        setLoading(true);
        fetchServerFormTemplate()
            .then((data) => {
                setFormTemplate(data);
                // Tìm textarea field và set giá trị mặc định
                const textareaField = data.find(field => field.id === 'textarea_note');
                if (textareaField?.textarea?.template) {
                    setFormValues((prev: Record<string, any>) => ({
                        ...prev,
                        textarea_note: textareaField.textarea.template
                    }));
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = useCallback((fieldId: string, value: any) => {
        setFormValues((prev: any) => ({
            ...prev,
            [fieldId]: value
        }));
    }, []);

    const handleTextAreaChange = (text: string) => {
        const template = formTemplate.find(field => field.id === 'textarea_note')?.textarea.template || '';
        const templateLines = template.split('\n');
        const currentLines = text.split('\n');

        const isTemplateProtected = templateLines.every((line: string, index: number) => {
            if (index >= currentLines.length) return false;
            return currentLines[index].startsWith(line.split(':')[0] + ':');
        });

        if (!isTemplateProtected) {
            const userContent = currentLines.slice(templateLines.length).join('\n');
            const restoredText = template + (userContent ? '\n' + userContent : '');
            setFormValues((prev: any) => ({
                ...prev,
                textarea_note: restoredText
            }));
            return;
        }

        setFormValues((prev: any) => ({
            ...prev,
            textarea_note: text
        }));
    };

    const getOptionsByRule = (field: any) => {
        let options = field.select.options;
        const filter = field.select.optionFilter;
        if (filter && formValues[filter.field] !== undefined && formValues[filter.field] !== "") {
            const num = parseInt(formValues[filter.field], 10) || 0;
            for (const rule of filter.rules) {
                if (num >= rule.min && num <= rule.max) {
                    if (filter.typeSelect === "hiden") {
                        options = options.map((option: any, index: number) => ({
                            ...option,
                            hidden: index >= rule.slice
                        }));
                    } else if (filter.typeSelect === "disabled") {
                        options = options.map((option: any, index: number) => ({
                            ...option,
                            isDisabled: index >= rule.slice
                        }));
                    } else {
                        options = options.slice(0, rule.slice);
                    }
                    break;
                }
            }
        }
        return options;
    };

    const evaluateVisibleIf = (visibleIf: any, values: any) => {
        if (!visibleIf) return true;
        if (visibleIf.notEmpty) {
            return values[visibleIf.field] !== undefined && values[visibleIf.field] !== '';
        }
        return values[visibleIf.field] === visibleIf.equals;
    };

    const getFieldsWithUserValue = () => {
        return formTemplate.map(field => {
            if (field.input) {
                return {
                    ...field,
                    input: {
                        ...field.input,
                        value: formValues[field.id] || '',
                        onChangeText: fieldHandlers[field.input.onChangeText as keyof typeof fieldHandlers]
                    }
                };
            }

            if (field.select) {
                const allOptions = getOptionsByRule(field);
                let visibleOptions = allOptions;
                if (field.select.optionFilter?.typeSelect === "hiden") {
                    visibleOptions = allOptions.filter((opt: any) => !opt.hidden);
                } else if (field.select.optionFilter?.typeSelect === "disabled") {
                    visibleOptions = allOptions.map((opt: any) => ({
                        ...opt,
                        disabled: true
                    }));
                }
                return {
                    ...field,
                    select: {
                        ...field.select,
                        selectedValue: formValues[field.id] || '',
                        options: visibleOptions,
                        onValueChange: fieldHandlers[field.select.onValueChange as keyof typeof fieldHandlers]
                    }
                };
            }



            if (field.textarea) {
                return {
                    ...field,
                    textarea: {
                        ...field.textarea,
                        value: formValues[field.id] || '',
                        onChangeText: fieldHandlers[field.textarea.onChangeText as keyof typeof fieldHandlers]
                    }
                };
            }
            if (field.dateInput) {
                return {
                    ...field,
                    dateInput: {
                        ...field.dateInput,
                        value: formValues[field.id] || '',
                        onChangeText: fieldHandlers[field.dateInput.onChangeText as keyof typeof fieldHandlers],
                        onRightIconPress: fieldHandlers[field.dateInput.onRightIconPress as keyof typeof fieldHandlers],
                    }
                };
            }
            if (field.buttons) {
                return {
                    ...field,
                    buttons: field.buttons.map((button: any) => ({
                        ...button,
                        onPress: fieldHandlers[button.onPress as keyof typeof fieldHandlers]
                    }))
                };
            }

            return field;
        }).filter(Boolean);
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formValues);
        setShowAlert(true);
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    };

    const fieldsToRender = getFieldsWithUserValue();

    return (
        <SafeAreaView flex={1} bg={colors.background.primary} pt={Platform.OS === 'android' ? StatusBar.currentHeight : 0}>
            <MHeader label={"Chi tiết danh mục"} showiconLeft onBack={() => navigation.goBack()} />
            <MScrollView refreshing={refreshing} onRefresh={onRefresh}>
                <View style={styles.container}>
                    {fieldsToRender
                        .filter(field => evaluateVisibleIf(field.select?.visibleIf ?? field.visibleIf, formValues))
                        .map(field => (
                            <DynamicFieldRenderer
                                key={field.id}
                                fieldData={field}
                                allValues={formValues}
                                onChange={handleChange}
                                navigation={navigation}
                            />
                        ))}
                </View>
            </MScrollView>
            <MAlert
                typeAlert="Confirm"
                visible={showAlert}
                title="Thông báo"
                message="Bạn có chắc chắn muốn lưu thay đổi?"
                onCancel={() => setShowAlert(false)}
                onConfirm={() => setShowAlert(false)}
                okText="Gửi"
                cancelText="Hủy"
            />
            <MSpinner loading={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    }
});

export default CatalogDetailsComponent;
