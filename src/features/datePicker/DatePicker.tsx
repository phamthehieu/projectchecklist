import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import moment from "moment";
import DatePickerC from 'react-native-date-picker';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  onClose?: () => void;
  mode?: 'date' | 'time' | 'datetime';
  minDate?: Date;
  maxDate?: Date;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  format?: string;
  isVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value = new Date(),
  onChange,
  onClose,
  mode = "date",
  minDate,
  maxDate,
  title = "Chọn ngày",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  format = "DD/MM/YYYY",
  isVisible = false,
  onVisibleChange,
}) => {
  const [date, setDate] = useState(moment(value).toDate());

  useEffect(() => {
    setDate(moment(value).toDate());
  }, [value]);

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    onChange?.(selectedDate);
    onVisibleChange?.(false);
  };

  const handleCancel = () => {
    onClose?.();
    onVisibleChange?.(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <DatePickerC
      modal
      mode={mode}
      open={isVisible}
      date={date}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      maximumDate={maxDate}
      minimumDate={minDate}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
    />
  );
};

export default DatePicker;

