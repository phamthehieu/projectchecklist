import React, { useState } from 'react';
import { useAppColors } from '../../../hooks/useAppColors';
import MInput from './MTextField';
import { CalendarDays } from 'lucide-react-native';
import DatePicker from '../../datePicker/DatePicker';
import moment from 'moment';

interface DateInputProps {
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur?: () => void;
    onRightIconPress?: () => void;
    showRightIcon?: boolean;
    maxLength?: number;
    error?: string;
    disabled?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    onBlur,
    onRightIconPress,
    showRightIcon = true,
    maxLength = 10,
    error,
    disabled
}) => {
    const colors = useAppColors();

    const formatDateInput = (text: string) => {
        let formattedText = text.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số

        if (formattedText.length <= 2) {
            formattedText = formattedText;
        } else if (formattedText.length <= 4) {
            formattedText = formattedText.slice(0, 2) + '-' + formattedText.slice(2);
        } else if (formattedText.length == 6) {
            formattedText = formattedText.slice(0, 1) + '-' + formattedText.slice(1, 2) + '-' + formattedText.slice(2);
        } else if (formattedText.length == 7) {
            formattedText = formattedText.slice(0, 2) + '-' + formattedText.slice(2, 3) + '-' + formattedText.slice(3);
        } else if (formattedText.length == 8) {
            formattedText = formattedText.slice(0, 2) + '-' + formattedText.slice(2, 4) + '-' + formattedText.slice(4);
        } else if (formattedText.length == 9) {
            formattedText = formattedText.slice(0, 3) + '-' + formattedText.slice(3, 5) + '-' + formattedText.slice(5);
        } else if (formattedText.length == 10) {
            formattedText = formattedText.slice(0, 3) + '-' + formattedText.slice(3, 5) + '-' + formattedText.slice(5);
        } else if (formattedText.length == 11) {
            formattedText = formattedText.slice(0, 4) + '-' + formattedText.slice(4, 6) + '-' + formattedText.slice(6);
        } else {
            formattedText = formattedText.slice(0, 10);
        }

        return formattedText;
    };

    return (
        <>
            <MInput
                label={label}
                placeholder={placeholder}
                value={value}
                keyboardType="numeric"
                maxLength={maxLength}
                rightIcon={
                    showRightIcon ? (
                        <CalendarDays
                            size={24}
                            color={colors.tailwind.black}
                        />
                    ) : null
                }
                showiconRight={showRightIcon}
                onRightIconPress={onRightIconPress}
                onChangeText={(text) => {
                    const formattedText = formatDateInput(text);
                    onChangeText(formattedText);
                }}
                onBlur={onBlur}
                error={error}
                disabled={disabled}
            />


        </>
    );
};

export default DateInput; 