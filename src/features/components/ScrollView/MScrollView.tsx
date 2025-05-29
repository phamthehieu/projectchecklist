import React from 'react';
import { ScrollView, RefreshControl, ScrollViewProps } from 'react-native';
import { useAppColors } from '../../../hooks/useAppColors';

interface MScrollViewProps extends ScrollViewProps {
    refreshing?: boolean;
    onRefresh?: () => void;
    refreshColors?: string[];
    progressBackgroundColor?: string;
}

const MScrollView: React.FC<MScrollViewProps> = ({
    refreshing = false,
    onRefresh,
    refreshColors,
    progressBackgroundColor,
    children,
    ...props
}) => {
    const colors = useAppColors();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={refreshColors || [colors.tailwind.blue[500]]}
                        progressBackgroundColor={progressBackgroundColor || colors.background.card}
                    />
                ) : undefined
            }
            {...props}
        >
            {children}
        </ScrollView>
    );
};

export default MScrollView; 