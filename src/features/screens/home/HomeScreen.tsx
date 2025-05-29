import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, StatusBar, Modal, Platform, PermissionsAndroid } from 'react-native';
import { Text, Icon, Box, HStack, Badge, BadgeText } from '@gluestack-ui/themed';
import { useAppColorMode } from '../../components/ColorModeContext';
import AvatarComponents from '../../components/Avatar/AvatarComponents';
import LinearGradient from 'react-native-linear-gradient';
import {
    Globe,
    Zap,
    Gift,
    Shield,
    Smartphone,
    Receipt,
    ShoppingCart,
    MoreHorizontal,
    Bell
} from 'lucide-react-native';
import { useAppColors } from '../../../hooks/useAppColors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
// import GpsBackgroundService from 'react-native-gps_background_service';

const paymentList = [
    { label: 'Internet', icon: Globe },
    { label: 'Electricity', icon: Zap },
    { label: 'Voucher', icon: Gift },
    { label: 'Assurance', icon: Shield },
    { label: 'Mobile Credit', icon: Smartphone },
    { label: 'Bill', icon: Receipt },
    { label: 'Merchant', icon: ShoppingCart },
    { label: 'More', icon: MoreHorizontal },
];
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Location {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
}

const HomeScreen = () => {
    const { colorMode } = useAppColorMode();
    const navigation = useNavigation<NavigationProp>();
    const colors = useAppColors();
    const isDarkMode = colorMode === 'dark';
    const [location, setLocation] = useState<Location | null>(null);

    const user = {
        name: 'Phạm Thế Hiếu',
        email: 'phamthehieu@gmail.com',
        phone: '0962591409',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Quyền truy cập vị trí",
                        message: "Ứng dụng cần quyền truy cập vị trí để theo dõi",
                        buttonNeutral: "Hỏi lại sau",
                        buttonNegative: "Từ chối",
                        buttonPositive: "Đồng ý"
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    const startTracking = async () => {
        // try {
        //     const hasPermission = await requestLocationPermission();
        //     if (!hasPermission) {
        //         console.error('Không có quyền truy cập vị trí');
        //         return;
        //     }

        //     console.log('Bắt đầu theo dõi vị trí');
        //     await GpsBackgroundService.startLocationUpdates();

        //     // Lấy vị trí hiện tại
        //     const currentLocation = await GpsBackgroundService.getLastLocation();
        //     if (currentLocation) {
        //         setLocation(currentLocation);
        //         console.log('Vị trí hiện tại:', currentLocation);
        //     }
        // } catch (error) {
        //     console.error('Lỗi khi bắt đầu theo dõi vị trí:', error);
        // }
    };

    // useEffect(() => {

    //     startTracking();

    //     GpsBackgroundService.addListener('onLocationUpdate', (newLocation: Location) => {
    //         setLocation(newLocation);
    //         console.log('Vị trí mới:', newLocation);
    //     });

    //     // Cleanup khi component unmount
    //     return () => {
    //         GpsBackgroundService.stopLocationUpdates();
    //     };
    // }, []);

    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={[colors.primary.main, colors.background.primary]}
            locations={[0.3, 1]}
        >
            <StatusBar
                translucent
                backgroundColor={colors.primary.main}
                barStyle="light-content"
            />
            <Box pt={48} px={24} zIndex={10}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={() => navigation.navigate('UserInformationScreen')}>
                        <AvatarComponents size="md" heading="Xin chào!" title={`${user.name}`} url={user.avatar} colorText={colors.text.reverse} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bellBtn, isDarkMode && { backgroundColor: 'rgba(255,255,255,0.2)' }]} onPress={() => navigation.navigate('NotificationScreen')}>
                        <Icon as={Bell} size="xl" color={colors.text.reverse} />
                        <Badge
                            size="sm"
                            variant="solid"
                            action="error"
                            rounded="$full"
                            top={-2}
                            right={-2}
                            zIndex={10}
                            position="absolute"
                        >
                            <BadgeText>3</BadgeText>
                        </Badge>
                    </TouchableOpacity>
                </View>
                <HStack
                    alignItems="center"
                    justifyContent="space-between"
                    mt={36}
                    backgroundColor={colors.background.card}
                    borderRadius={16}
                    padding={12}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isDarkMode ? 0.2 : 0.12,
                        shadowRadius: 12,
                        elevation: 8,
                    }}>
                    <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => navigation.navigate('CheckListTotalScreen')}>
                        <Box p={16} borderRadius={10} backgroundColor={colors.input.background}>
                            <Icon as={Globe} size="xl" color={colors.primary.main} />
                        </Box>
                        <Text style={[styles.paymentLabel, isDarkMode && { color: colors.text.primary }]}>Internet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('CheckListTotalScreen')}>
                        <Box p={16} borderRadius={10} backgroundColor={colors.input.background}>
                            <Icon as={Globe} size="xl" color={colors.primary.main} />
                        </Box>
                        <Text style={[styles.paymentLabel, isDarkMode && { color: colors.text.primary }]}>Internet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: 12 }} onPress={() => navigation.navigate('CheckListTotalScreen')}>
                        <Box p={16} borderRadius={10} backgroundColor={colors.input.background}>
                            <Icon as={Globe} size="xl" color={colors.primary.main} />
                        </Box>
                        <Text style={[styles.paymentLabel, isDarkMode && { color: colors.text.primary }]}>Internet</Text>
                    </TouchableOpacity>
                </HStack>
            </Box>

            <Box
                backgroundColor={colors.background.card}
                flex={1}
                mt={-48}
                borderTopLeftRadius={24}
                borderTopRightRadius={24}
            >
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24, marginTop: 80 }}>
                    <Box px={24}>
                        {location && (
                            <Box mb={4} p={4} backgroundColor={colors.input.background} borderRadius={8}>
                                <Text style={[styles.paymentLabel, isDarkMode && { color: colors.text.primary }]}>
                                    Vĩ độ: {location.latitude.toFixed(6)}
                                </Text>
                                <Text style={[styles.paymentLabel, isDarkMode && { color: colors.text.primary }]}>
                                    Kinh độ: {location.longitude.toFixed(6)}
                                </Text>
                                <Text style={[styles.paymentLabel, isDarkMode && { color: colors.text.primary }]}>
                                    Độ chính xác: {location.accuracy.toFixed(2)}m
                                </Text>
                            </Box>
                        )}
                        <Text style={[styles.paymentTitle, isDarkMode && { color: colors.text.primary }]}>Menu</Text>
                        <View style={styles.paymentGrid}>
                            {paymentList.map((item, idx) => (
                                <TouchableOpacity key={item.label} style={styles.paymentItem} onPress={startTracking}>
                                    <Box style={[styles.paymentIconBox, isDarkMode && { backgroundColor: colors.input.background }]}>
                                        <Icon as={item.icon} size="xl" color={colors.primary.main} />
                                    </Box>
                                    <Text style={[styles.paymentLabel, isDarkMode && { color: colors.text.primary }]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Box>
                </ScrollView>
            </Box>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerBg: {
        paddingTop: 48,
        paddingBottom: 32,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    bellBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        padding: 8,
    },
    balanceLabel: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        opacity: 0.8,
    },
    balanceValue: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 8,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 20,
        padding: 12,
        marginTop: 24,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    paymentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    paymentItem: {
        width: '22%',
        alignItems: 'center',
        marginBottom: 20,
    },
    paymentIconBox: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
    },
    paymentLabel: {
        fontSize: 13,
        textAlign: 'center',
    },
    promoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    promoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    seeMore: {
        fontSize: 14,
        fontWeight: '500',
    },
    promoCard: {
        borderRadius: 16,
        padding: 20,
        marginTop: 8,
    },
    promoCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    promoCardDesc: {
        fontSize: 13,
        opacity: 0.8,
    },
});

export default HomeScreen;