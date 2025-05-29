import React, { useState } from 'react';
import {
    Alert,
    Animated,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { CurvedBottomBar } from './CurvedBottomBar';
import { Icon, Badge, BadgeText } from '@gluestack-ui/themed';
import { House, CalendarDaysIcon, UserCircle, FileText, LucideQrCode } from "lucide-react-native";
import HomeScreen from '../home/HomeScreen';
import CalendarScreen from '../calendar/CalendarScreen';
import SettingScreen from '../setting/SettingScreen';
import { useAppColorMode } from '../../components/ColorModeContext';
import { useAppColors } from '../../../hooks/useAppColors';
import QrCodeComponent from '../../components/Camera/QrCodeComponent';

const Screen2 = () => {
    return <View style={styles.screen2} />;
};

const BottomBarScreen: React.FC = () => {
    const { colorMode } = useAppColorMode();
    const colors = useAppColors();

    const _renderIcon = (routeName: any, selectedTab: any) => {
        let icon;
        let badgeCount = 0;

        switch (routeName) {
            case 'HomeScreen':
                icon = House;
                break;
            case 'CalendarScreen':
                icon = CalendarDaysIcon;
                break;
            case 'title3':
                icon = FileText;
                break;
            case 'SettingScreen':
                icon = UserCircle;
                break;
        }

        return (
            <View style={styles.iconContainer}>
                <Icon
                    as={icon}
                    size={"xl"}
                    color={routeName === selectedTab
                        ? colors.primary.main
                        : colors.icon.secondary}
                />
                {badgeCount > 0 && (
                    <Badge
                        rounded="$full"
                        size="sm"
                        variant="solid"
                        action="error"
                        zIndex={10}
                        position="absolute"
                        top={-5}
                        right={-10}
                    >
                        <BadgeText>{badgeCount}</BadgeText>
                    </Badge>
                )}
            </View>
        );
    };
    const renderTabBar = ({ routeName, selectedTab, navigate }: any) => {
        return (
            <TouchableOpacity
                onPress={() => navigate(routeName)}
                style={styles.tabbarItem}
            >
                {_renderIcon(routeName, selectedTab)}
            </TouchableOpacity>
        );
    };

    return (
        <CurvedBottomBar.Navigator
            id="bottom-tab-navigator"
            type="DOWN"
            shadowStyle={styles.shawdow}
            height={55}
            circleWidth={50}
            bgColor={colors.background.card}
            borderWidth={1}
            borderColor={colors.input.border}
            initialRouteName="title1"
            borderTopLeftRight={false}
            renderCircle={({ selectedTab, navigate }: any) => (
                <>
                    <Animated.View style={[styles.btnCircleUp, { backgroundColor: colors.tailwind.red[500] }]}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigate('QrCodeComponent')}
                        >
                            <Icon as={LucideQrCode} size={"xl"} color={colors.tailwind.white} />
                        </TouchableOpacity>
                    </Animated.View>

                </>
            )}
            tabBar={renderTabBar}
        >
            <CurvedBottomBar.Screen
                name="HomeScreen"
                position="LEFT"
                component={() => <HomeScreen />}
                options={{ headerShown: false }}
            />
            <CurvedBottomBar.Screen
                name="CalendarScreen"
                position="LEFT"
                component={() => <CalendarScreen />}
                options={{ headerShown: false }}
            />
            <CurvedBottomBar.Screen
                name="title3"
                component={() => <Screen2 />}
                position="RIGHT"
                options={{ headerShown: false }}
            />
            <CurvedBottomBar.Screen
                name="SettingScreen"
                component={() => <SettingScreen />}
                position="RIGHT"
                options={{ headerShown: false }}
            />
        </CurvedBottomBar.Navigator>
    );
}

export default BottomBarScreen;
export const styles = StyleSheet.create({
    shawdow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
    },
    btnCircleUp: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 1,
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    screen1: {
        flex: 1,
        backgroundColor: '#BFEFFF',
    },
    screen2: {
        flex: 1,
        backgroundColor: '#FFEBCD',
    },
    iconContainer: {
        position: 'relative',
    }
});
