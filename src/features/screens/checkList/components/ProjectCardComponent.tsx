import { AlertTriangle, Ellipsis } from "lucide-react-native";
import { Send } from "lucide-react-native";
import { useAppColors } from "../../../../hooks/useAppColors";
import { Box, Text, VStack, HStack, Badge, BadgeText, Progress, ProgressFilledTrack, Icon, Button } from "@gluestack-ui/themed";
import MenuComponent from "../../../components/Menu/MenuComponents";

interface ProjectCardProps {
    title: string;
    description: string;
    progress: number;
    total: number;
    daysLeft: number;
    color: string;
}
export const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, progress, total, daysLeft, color }) => {
    const colors = useAppColors();

    const menuItems = [
        { key: 'send', label: 'Gửi lên server', icon: Send, color: colors.tailwind.blue[500] },
        { key: 'error', label: 'Báo lỗi', icon: AlertTriangle, color: colors.tailwind.red[500] },
    ];

    return (
        <Box bg={colors.background.card} borderRadius={16} p={20} m={16} shadowColor="#000" shadowOpacity={0.07} shadowRadius={8} elevation={2}>
            <HStack alignItems="center" justifyContent="space-between">
                <VStack>
                    <Text fontWeight="$bold" fontSize={18} mb={8} color={color} mt={8} >{title}</Text>
                    <Text color={colors.text.secondary} mb={16} fontSize={13} mt={8}>{description}</Text>
                </VStack>
                <Box position="absolute" right={-20} top={0} zIndex={999}>
                    <MenuComponent
                        items={menuItems}
                        triggerLabel={''}
                        onSelect={(key) => {
                            if (key === 'send') {
                                // TODO: Xử lý gửi lên server
                            } else if (key === 'error') {
                                // TODO: Xử lý báo lỗi
                            }
                        }}
                        placement="bottom right"
                        trigger={(triggerProps, state) => (
                            <Button
                                {...triggerProps}
                                bg="transparent"
                                p={4}
                                borderRadius={20}
                                minWidth={1}
                                minHeight={1}
                                style={{ alignSelf: 'flex-end' }}
                            >
                                <Icon as={Ellipsis} size="lg" color={colors.text.inverse} />
                            </Button>
                        )}


                    />
                </Box>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between" mb={8} mt={16}>
                <Badge bg={color} borderRadius={20} px={16} py={4}>
                    <BadgeText color={colors.text.reverse} fontWeight="$bold" fontSize={15}>{progress} / {total}</BadgeText>
                </Badge>
                <Text color={colors.text.secondary} fontSize={13}>{daysLeft} Days Left</Text>
            </HStack>
            <Progress value={(progress / total) * 100} size="xs" bg={colors.background.card} borderRadius={3} mt={8} mb={8}>
                <ProgressFilledTrack bg={color} />
            </Progress>
        </Box>
    )
};