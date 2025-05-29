import React from 'react';
import SelectComponent from '../Select/SelectComponents';
import { StyleSheet } from 'react-native';

interface LanguageSelectProps {
    selectedLanguage?: string;
    onLanguageChange?: (value: string) => void;
    readonly?: boolean;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
    selectedLanguage,
    onLanguageChange,
    readonly
}) => {

    const languageOptions = [
        { label: 'Tiếng Việt', value: 'vi' },
        { label: 'English', value: 'en' },
        // { label: '中文', value: 'zh' },
        // { label: '日本語', value: 'ja' },
        // { label: '한국어', value: 'ko' },
    ];

    const valueDefault = languageOptions.find(option => option.value === selectedLanguage);

    return (
        <SelectComponent
            options={languageOptions}
            placeholder="Chọn ngôn ngữ"
            selectedValue={valueDefault}
            onValueChange={onLanguageChange}
            readonly={readonly}
            style={styles.select}
            variant="rounded"
        />
    );
};

const styles = StyleSheet.create({
    select: {
        minWidth: 150,
        flex: 1,
    }
});

export default LanguageSelect; 