import { AvatarFallbackText, VStack, HStack, Avatar, Text, Pressable, Icon, Box } from "@gluestack-ui/themed";
import { useAppColors } from "../../../../hooks/useAppColors";
import { EllipsisVertical } from "lucide-react-native";

const NotificationItem = ({ item }: any) => {
    const colors = useAppColors();
    return (
        <Box
            bg={colors.background.secondary}
            borderRadius={16}
            shadowColor={colors.text.primary}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
            elevation={2}
            mx={2}
            my={1}
            marginBottom={16}
            marginTop={6}
            borderLeftWidth={4}
            borderLeftColor={item.isRead ? 'transparent' : '#1A3CCE'}
        >
            <HStack py={14} alignItems="center" px={4} space="md">
                <Avatar size="md" bgColor={item.avatar.color}>
                    <AvatarFallbackText>{item.avatar.label}</AvatarFallbackText>
                </Avatar>
                <VStack flex={1}>
                    <HStack alignItems="flex-start" justifyContent="space-between">
                        <VStack flex={1} mr={4}>
                            <HStack flexWrap="wrap">
                                <Text
                                    fontWeight={item.isRead ? "normal" : "bold"}
                                    color={colors.text.primary}
                                >
                                    {item.name}
                                </Text>
                                <Text
                                    mx={2}
                                    color={colors.text.primary}
                                    fontWeight={item.isRead ? "normal" : "bold"}
                                >
                                    {item.content}
                                </Text>
                            </HStack>
                            <Text
                                color={colors.text.primary}
                                fontSize={13}
                                fontWeight={item.isRead ? "normal" : "bold"}
                            >
                                {item.post ? item.post + ' - ' : ''}{item.time}
                            </Text>
                        </VStack>
                        <Pressable
                            borderWidth={1}
                            borderColor="transparent"
                            borderRadius={999}
                            p={7}
                            bg="transparent"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Icon as={EllipsisVertical} color={colors.text.primary} size={"xl"} />
                        </Pressable>
                    </HStack>
                </VStack>
            </HStack>
        </Box>
    );
};

export default NotificationItem;