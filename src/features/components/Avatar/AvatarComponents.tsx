import React from 'react';
import { Avatar, AvatarBadge, AvatarFallbackText, HStack, VStack, Heading, Text, AvatarImage, Icon } from '@gluestack-ui/themed'; // Nhập các component từ thư viện gluestack-ui để xây dựng dialog
import { useAppColorMode } from '../ColorModeContext';
import { Camera } from 'lucide-react-native';
import { useAppColors } from '../../../hooks/useAppColors';

interface AvatarComponentsProps {
    size?: "xs" | "sm" | "md" | "lg" | 'xl' | "2xl";
    titleImage?: string;
    url?: string;
    heading?: string;
    title?: string;
    hStackSpace?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    hStackAlignItems?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
    hStackJustifyContent?: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
    vStackSpace?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    vStackAlignItems?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
    rounded?: "HStack" | "VStack";
    showCamera?: boolean;
    colorText?: string;
}

const AvatarComponents: React.FC<AvatarComponentsProps> = ({
    size = "md",
    titleImage,
    url = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    heading = "Tên",
    title = "Title",
    hStackSpace,
    hStackAlignItems = "center",
    hStackJustifyContent = "center",
    vStackSpace,
    vStackAlignItems = "center",
    rounded = "HStack",
    showCamera = false,
    colorText,
}) => {
    const colors = useAppColors();

    return (
        <>
            {rounded === "HStack" ? (
                <HStack
                    space={hStackSpace || size}
                    alignItems={hStackAlignItems}
                    justifyContent={hStackJustifyContent}
                >
                    <Avatar size={size} bgColor={colors.background.card}>
                        <AvatarFallbackText color={colors.text.primary}>
                            {titleImage}
                        </AvatarFallbackText>
                        <AvatarImage
                            size={size}
                            source={{
                                uri: url,
                            }}
                        />
                        {showCamera && (
                            <AvatarBadge
                                bg={colors.tailwind.white}
                                borderColor="$white"
                                position="absolute"
                                right={5}
                                bottom={5}
                                width={30}
                                height={30}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Icon as={Camera} color={colors.tailwind.gray[500]} size="xl" />
                            </AvatarBadge>
                        )}
                    </Avatar>
                    <VStack space={vStackSpace} alignItems={vStackAlignItems}>
                        <Heading textAlign="center" size="sm" color={colorText || colors.text.primary}>{heading}</Heading>
                        <Text textAlign="center" size="sm" color={colorText || colors.text.primary}>{title}</Text>
                    </VStack>
                </HStack>
            ) : (
                <VStack
                    space={vStackSpace || size}
                    alignItems={vStackAlignItems}
                >
                    <Avatar size={size} bgColor={colors.background.card}>
                        <AvatarFallbackText color={colors.text.primary}>
                            {titleImage}
                        </AvatarFallbackText>
                        <AvatarImage
                            size={size}
                            source={{
                                uri: url,
                            }}
                        />
                        {showCamera && (
                            <AvatarBadge
                                bg={colors.tailwind.white}
                                borderColor="$white"
                                position="absolute"
                                right={5}
                                bottom={5}
                                width={30}
                                height={30}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Icon as={Camera} color={colors.tailwind.gray[500]} size="xl" />
                            </AvatarBadge>
                        )}
                    </Avatar>
                    <VStack space={vStackSpace} alignItems={vStackAlignItems}>
                        <Heading textAlign="center" size="sm" color={colorText || colors.text.primary}>{heading}</Heading>
                        <Text textAlign="center" size="sm" color={colorText || colors.text.primary}>{title}</Text>
                    </VStack>
                </VStack>
            )}
        </>
    );
};

export default AvatarComponents; 