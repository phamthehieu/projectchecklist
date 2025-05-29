import { Badge, BadgeText, HStack } from "@gluestack-ui/themed";
import { ScrollView } from "react-native";


interface TabBarProps {
    tabs: string[];
}
export const TabBar: React.FC<TabBarProps> = ({ tabs }) => (
    <HStack space="md" px={12} py={8}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab, idx) => (
                <Badge key={idx} bg={idx === 0 ? "$red500" : "$coolGray200"} borderRadius={8} px={12} py={6} mr={idx !== tabs.length - 1 ? 8 : 0}>
                    <BadgeText color={idx === 0 ? "$white" : "$black"} fontWeight="$bold">{tab}</BadgeText>
                </Badge>
            ))}
        </ScrollView>
    </HStack>
);