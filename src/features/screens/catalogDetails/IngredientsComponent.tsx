import React, { useState } from 'react';
import SelectComponent from '../../components/Select/SelectComponents';
import CameraComponent from '../../components/Camera/CameraComponent';
import VideoComponnent from '../../components/Camera/VideoComponnent';
import CheckboxListComponent from '../../components/CheckboxList/CheckboxListComponent';
import TextareaComponent from '../../components/Textarea/TextareaComponents';
import DateInputComponent from '../../components/Input/DateInputComponent';
import MButton from '../../components/Button/ButtonComponents';
import MInput from '../../components/Input/MTextField';
import { Text, Box, View, ScrollView, VStack, HStack } from '@gluestack-ui/themed';
import { Dimensions } from 'react-native';
import { styles } from './style';
import SwitchList from '../../../components/SwitchList';
import { useAppColors } from '../../../hooks/useAppColors';
import DatePicker from '../../datePicker/DatePicker';
import moment from 'moment';

const DEVICE_WIDTH = Dimensions.get('window').width;

interface IngredientsComponentProps {
    data: any;
    onChange?: (data: any) => void;
    onChangeAutoText?: (data: any) => void;
    navigation?: any;
}

const IngredientsComponent: React.FC<IngredientsComponentProps> = ({ data, onChange, onChangeAutoText, navigation }) => {
    const colors = useAppColors();
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        const formattedDate = moment(date).format('DD-MM-YYYY');
        if (data.dateInput?.onChangeText) {
            data.dateInput.onChangeText(formattedDate);
        }
        setIsDatePickerVisible(false);
    };

    const childType = (data: any) => {
        switch (data.type) {
            case 1:
                return (
                    <Text color={data.text.color} fontSize={data.text.fontSize} fontWeight={data.text.fontWeight} >{data.text.value}</Text>
                )
            case 2:
                return (
                    <MInput
                        label={data.input.label}
                        placeholder={data.input.placeholder}
                        value={data.input.value}
                        onChangeText={data.input.onChangeText}
                        secure={data.input.secureTextEntry}
                        onRightIconPress={data.input.onRightIconPress}
                        labelRequired={data.input.labelRequired}
                        containerStyle={data.input.containerStyle}
                        inputStyle={data.input.inputStyle}
                        inputContainerStyle={data.input.inputContainerStyle}
                        leftIcon={data.input.leftIcon}
                        keyboardType={data.input.keyboardType}
                        onBlur={data.input.onBlur}
                        onFocus={data.input.onFocus}
                        readOnly={data.input.readOnly}
                        rightIcon={data.input.rightIcon}
                        onSubmitEditing={data.input.onSubmitEditing}
                        returnKeyType={data.input.returnKeyType}
                        chuthich={data.input.chuthich}
                        multiline={data.input.multiline}
                        upcase={data.input.upcase}
                        showLabel={data.input.showLabel}
                        showChuThich={data.input.showChuThich}
                        showiconLeft={data.input.showiconLeft}
                        showiconRight={data.input.showiconRight}
                        colorIconLeft={data.input.colorIconLeft}
                        colorIconRight={data.input.colorIconRight}
                        maxLength={data.input.maxLength}
                        autoCapitalize={data.input.autoCapitalize}
                        error={data.input.error}
                        disabled={data.input.disabled}
                        testID={data.input.testID}
                        borderRadius={data.input.borderRadius}
                        size={data.input.size}
                        height={data.input.height}
                    />
                )
            case 3:
                return (
                    <SelectComponent
                        options={data.select.options}
                        placeholder={data.select.placeholder}
                        selectedValue={data.select.selectedValue}
                        onValueChange={data.select.onValueChange}
                        showIconLeft={data.select.showIconLeft}
                        iconLeft={data.select.iconLeft}
                        label={data.select.label}
                        labelRequired={data.select.labelRequired}
                        chuthich={data.select.chuthich}
                        readonly={data.select.readonly}
                        style={data.select.style}
                        variant={data.select.variant}
                        size={data.select.size}
                        heightProps={data.select.heightProps}
                        borderRadius={data.select.borderRadius}
                    />
                )
            case 4:
                return (
                    <CameraComponent
                        config={data.camera.config}
                        onImagesChange={data.camera.onImagesChange}
                        onImageSelect={data.camera.onImageSelect}
                        onImageEdit={data.camera.onImageEdit}
                        onImageDelete={data.camera.onImageDelete}
                        buttonTitle={data.camera.buttonTitle}
                        showButton={data.camera.showButton}
                        containerStyle={data.camera.containerStyle}
                        imageContainerStyle={data.camera.imageContainerStyle}
                        maxImages={data.camera.maxImages}
                        initialImages={data.camera.initialImages}
                        showImageTamplate={data.camera.showImageTamplate}
                        imageTamplate={data.camera.imageTamplate}
                    />
                )
            case 5:
                return (
                    <VideoComponnent
                        containerStyle={data.video.containerStyle}
                        buttonStyle={data.video.buttonStyle}
                        buttonTextStyle={data.video.buttonTextStyle}
                        buttonTitle={data.video.buttonTitle}
                        showButton={data.video.showButton}
                        buttonIcon={data.video.buttonIcon}
                        buttonIconSize={data.video.buttonIconSize}
                        videoListStyle={data.video.videoListStyle}
                        videoItemStyle={data.video.videoItemStyle}
                        videoThumbnailStyle={data.video.videoThumbnailStyle}
                        maxVideos={data.video.maxVideos}
                        onVideoListChange={data.video.onVideoListChange}
                        videoRecordingProps={data.video.videoRecordingProps}
                        videoPlayerStyle={data.video.videoPlayerStyle}
                        videoPlayerControls={data.video.videoPlayerControls}
                        videoPlayerRepeat={data.video.videoPlayerRepeat}
                        deleteAlertTitle={data.video.deleteAlertTitle}
                        deleteAlertMessage={data.video.deleteAlertMessage}
                        deleteAlertOkText={data.video.deleteAlertOkText}
                        deleteAlertCancelText={data.video.deleteAlertCancelText}
                        onVideoAdd={data.video.onVideoAdd}
                        onVideoDelete={data.video.onVideoDelete}
                        onVideoSelect={data.video.onVideoSelect}
                    />
                )
            case 6:
                return (
                    <CheckboxListComponent
                        items={data.checkbox.items || []}
                        selectedValues={data.checkbox.value || []}
                        onChange={data.checkbox.onChange}
                        containerStyle={data.checkbox.containerStyle}
                        checkboxStyle={data.checkbox.checkboxStyle}
                        labelStyle={data.checkbox.labelStyle}
                    />
                )
            case 7:
                return (
                    <TextareaComponent
                        label={data.textarea.label}
                        labelRequired={data.textarea.labelRequired}
                        size={data.textarea.size}
                        borderRadius={data.textarea.borderRadius}
                        placeholder={data.textarea.placeholder}
                        isReadOnly={data.textarea.isReadOnly}
                        value={data.textarea.value}
                        onChangeText={data.textarea.onChangeText}
                        textareaInputProps={data.textarea.textareaInputProps}
                        template={data.textarea.template}
                        templateFields={data.textarea.templateFields}
                        onValidationError={data.textarea.onValidationError}
                        containerStyle={data.textarea.containerStyle}
                    />
                )
            case 8:
                return (
                    <DateInputComponent
                        label={data.dateInput.label}
                        placeholder={data.dateInput.placeholder}
                        value={data.dateInput.value}
                        onChangeText={data.dateInput.onChangeText}
                        onBlur={data.dateInput.onBlur}
                        onRightIconPress={() => setIsDatePickerVisible(true)}
                        showRightIcon={data.dateInput.showRightIcon}
                        maxLength={data.dateInput.maxLength}
                        error={data.dateInput.error}
                        disabled={data.dateInput.disabled}
                    />
                )

            case 9:
                return (
                    <SwitchList
                        title={data.switchList.title}
                        items={data.switchList.items}
                        onValueChange={data.switchList.onValueChange}
                    />
                )

            default:
                return null;
        }
    }

    return (
        <>
            {data.type != 10 ?
                <Box
                    marginBottom={16}
                    style={styles.row}
                    bg={colors.background.card}
                    shadowColor="$gray900"
                    shadowOffset={{ width: 0, height: 2 }}
                    shadowOpacity={0.25}
                    shadowRadius={3.84}
                    elevation={5}
                    borderRadius={18}
                    margin={4}
                    width={DEVICE_WIDTH - 8}
                    flexShrink={1}
                    flexGrow={1}
                >
                    {data.type != 10 &&
                        <Box padding={12} marginTop={12} marginBottom={18} width="$full">
                            {childType(data)}
                        </Box>
                    }
                </Box>
                :
                <Box marginBottom={18} width="$full">
                    <HStack justifyContent="space-between" alignItems="center" gap={4} space="xl">
                        {data.buttons?.map((button: any, index: number) => (
                            <Box key={index} flex={1}>
                                <MButton
                                    title={button.title}
                                    size={button.size}
                                    type={button.type}
                                    variant={button.variant}
                                    action={button.action}
                                    onPress={() => button.onPress()}
                                />
                            </Box>
                        ))}
                    </HStack>
                </Box>
            }
            <DatePicker
                isVisible={isDatePickerVisible}
                onVisibleChange={setIsDatePickerVisible}
                value={selectedDate}
                onChange={handleDateChange}
                mode="date"
                format="DD-MM-YYYY"
                title="Chọn ngày"
                confirmText="Xác nhận"
                cancelText="Hủy"
            />
        </>
    );
};

export default React.memo(IngredientsComponent);

