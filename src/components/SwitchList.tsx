import React from 'react';
import { Switch, Box, Text, VStack } from '@gluestack-ui/themed';

interface SwitchItem {
    id: string;
    label: string;
    value: boolean;
}

interface SwitchListProps {
    items: SwitchItem[];
    onValueChange: (id: string, value: boolean) => void;
    title?: string;
}

const SwitchList: React.FC<SwitchListProps> = ({ items, onValueChange, title }) => {
    return (
        <Box>
            {title && (
                <Text fontSize="$lg" fontWeight="$bold" mb="$2">
                    {title}
                </Text>
            )}
            <VStack space="md">
                {items.map((item) => (
                    <Box
                        key={item.id}
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        py="$2"
                    >
                        <Text fontSize="$md">{item.label}</Text>
                        <Switch
                            value={item.value}
                            onValueChange={(value) => onValueChange(item.id, value)}
                        />
                    </Box>
                ))}
            </VStack>
        </Box>
    );
};

export default SwitchList; 