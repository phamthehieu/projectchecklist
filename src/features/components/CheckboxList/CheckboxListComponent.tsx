import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxGroup, CheckboxLabel } from '@gluestack-ui/themed';

interface CheckboxItem {
    value: string;
    label: string;
    disabled?: boolean;
}

interface CheckboxListProps {
    items: CheckboxItem[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    containerStyle?: any;
    checkboxStyle?: any;
    labelStyle?: any;
}

const CheckboxListComponent: React.FC<CheckboxListProps> = ({
    items,
    selectedValues,
    onChange,
    containerStyle,
    checkboxStyle,
    labelStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <CheckboxGroup
                value={selectedValues}
                onChange={onChange}
            >
                {items.map((item) => (
                    <Checkbox
                        key={item.value}
                        value={item.value}
                        isDisabled={item.disabled}
                        style={[styles.checkbox, checkboxStyle]}
                    >
                        <CheckboxIndicator>
                            <CheckboxIcon />
                        </CheckboxIndicator>
                        <CheckboxLabel style={[styles.label, labelStyle]}>
                            {item.label}
                        </CheckboxLabel>
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    checkbox: {
        marginVertical: 4,
    },
    label: {
        marginLeft: 8,
    },
});

export default CheckboxListComponent; 