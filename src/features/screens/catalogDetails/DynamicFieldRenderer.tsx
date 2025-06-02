import React from 'react';
import IngredientsComponent from './IngredientsComponent';

interface DynamicFieldRendererProps {
    fieldData: any;
    allValues: any;
    onChange: (fieldId: string, value: any) => void;
    navigation?: any;
}

const evaluateVisibleIf = (visibleIf: any, allValues: any): boolean => {
    if (!visibleIf) return true;
    if (visibleIf.field) {
        const targetValue = allValues[visibleIf.field];

        if (visibleIf.equals !== undefined) return targetValue === visibleIf.equals;

        if (visibleIf.notEmpty) return targetValue !== undefined && targetValue !== null && targetValue !== '';

        if (visibleIf.greaterThan !== undefined) return targetValue > visibleIf.greaterThan;

        if (visibleIf.lessThan !== undefined) return targetValue < visibleIf.lessThan;

        if (visibleIf.condition !== undefined && typeof visibleIf.condition === 'function') {
            const result = visibleIf.condition(targetValue);
            return Array.isArray(result) ? result.length > 0 : result;
        }
    }
    return true;
};


const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ fieldData, allValues, onChange, navigation }) => {
    const isVisible = evaluateVisibleIf(fieldData.visibleIf, allValues);

    if (!isVisible) return null;

    return (
        <IngredientsComponent
            data={fieldData}
            onChange={(value) => onChange(fieldData.id, value)}
            navigation={navigation}
        />
    );
};

export default DynamicFieldRenderer;
