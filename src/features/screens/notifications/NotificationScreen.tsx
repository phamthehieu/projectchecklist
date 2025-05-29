import React, { useState } from 'react';
import { SafeAreaView, Platform, StatusBar, ScrollView, Modal, View, TouchableOpacity } from 'react-native';
import {
    VStack, HStack, Text, Pressable, Avatar, AvatarFallbackText, Icon, Divider
} from '@gluestack-ui/themed';
import { ListFilter } from 'lucide-react-native';
import { useAppColors } from '../../../hooks/useAppColors';
import MHeader from '../../components/header/MHeader';
import { useTranslation } from 'react-i18next';
import MScrollView from '../../components/ScrollView/MScrollView';
import NotificationItem from './components/NotificationItemComponent';
import SelectComponent from '../../components/Select/SelectComponents';

const notifications = [
    // Today
    {
        id: '1',
        name: 'Ronaldo',
        avatar: { label: 'CR', color: '#F59E42' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '2h ago',
        group: 'today',
        isRead: false,
    },
    {
        id: '2',
        name: 'Costas',
        avatar: { label: 'CS', color: '#2739D6' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '2h ago',
        group: 'today',
        isRead: true,
    },
    {
        id: '3',
        name: 'Jeremy',
        avatar: { label: 'JD', color: '#E03C32' },
        content: 'mention you in new post',
        post: '@jeremypassos',
        time: '2h ago',
        group: 'today',
    },
    // This Week
    {
        id: '4',
        name: 'Malika',
        avatar: { label: 'MC', color: '#FFB400' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '3h ago',
        group: 'week',
    },
    {
        id: '5',
        name: 'Jonathan',
        avatar: { label: 'JF', color: '#5D6CF5' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '3h ago',
        group: 'week',
    },
    {
        id: '6',
        name: 'Warren Buffet',
        avatar: { label: 'WA', color: '#1193F5' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '3h ago',
        group: 'week',
    },
    {
        id: '7',
        name: 'Warren Buffet',
        avatar: { label: 'WA', color: '#1193F5' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '3h ago',
        group: 'week',
    },
    {
        id: '8',
        name: 'Warren Buffet',
        avatar: { label: 'WA', color: '#1193F5' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '3h ago',
        group: 'week',
    },
    {
        id: '9',
        name: 'Warren Buffet',
        avatar: { label: 'WA', color: '#1193F5' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '3h ago',
        group: 'week',
    },
    {
        id: '10',
        name: 'Warren Buffet',
        avatar: { label: 'WA', color: '#1193F5' },
        content: 'Liked your posted',
        post: 'Favourites Places',
        time: '3h ago',
        group: 'week',
    },
];



const SectionHeader = ({ title }: any) => {
    const colors = useAppColors();
    return (

        <Text fontWeight="bold" mt={24} mb={8} px={4} fontSize={15} color={colors.text.primary}>
            {title}
        </Text>
    )
};

const NotificationScreen = ({ navigation }: any) => {
    const colors = useAppColors();
    const today = notifications.filter(x => x.group === 'today');
    const week = notifications.filter(x => x.group === 'week');
    const { t } = useTranslation();

    const [refreshing, setRefreshing] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [sortOptions, setSortOptions] = useState({
        newest: false,
        older: false,
        read: false,
        unread: false,
    } as const);

    type SortOptionKey = keyof typeof sortOptions;

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    const filterOptions = [
        { label: t('newest_first'), value: 'newest' },
        { label: t('older_first'), value: 'older' },
        { label: t('read_notification'), value: 'read' },
        { label: t('unread_notification'), value: 'unread' },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <MHeader label={t('notifications')} showiconLeft onBack={() => { navigation.goBack() }} />
            <VStack flex={1} bgColor={colors.background.primary} marginHorizontal={16}>
                <HStack justifyContent="space-between" alignItems="center" px={4} mt={8} mb={4}>
                    <VStack>
                        <Text
                            fontSize={22}
                            fontWeight="bold"
                            color={colors.text.primary}
                            style={{ borderRadius: 5, alignSelf: 'flex-start', paddingHorizontal: 2 }}
                        >
                            {t('notifications')}
                        </Text>
                        <Text fontSize={14} color={colors.text.primary} mt={8} >
                            {t('you_have')} <Text fontWeight="bold" color="#1A3CCE">2</Text> {t('notifications_today')}
                        </Text>
                    </VStack>
                    <Pressable
                        bg={colors.background.secondary}
                        borderRadius={999}
                        p={8}
                        alignItems="center"
                        justifyContent="center"
                        onPress={() => setShowFilter(true)}
                    >
                        <Icon as={ListFilter} color={colors.text.primary} size={"xl"} />
                    </Pressable>
                </HStack>

                {/* Modal filter */}
                <Modal
                    visible={showFilter}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowFilter(false)}
                >
                    <TouchableOpacity
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
                        activeOpacity={1}
                        onPressOut={() => setShowFilter(false)}
                    >
                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.background.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }} color={colors.text.primary}>{t('sort_by')}</Text>
                            {filterOptions.map(opt => (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
                                    onPress={() => setSortOptions(prev => ({ ...prev, [opt.value as SortOptionKey]: !prev[opt.value as SortOptionKey] }))}
                                    activeOpacity={0.7}
                                >
                                    <View style={{
                                        width: 22, height: 22, borderRadius: 11, borderWidth: 2,
                                        borderColor: '#3478F6', alignItems: 'center', justifyContent: 'center', marginRight: 12
                                    }}>
                                        {sortOptions[opt.value as SortOptionKey] && (
                                            <View style={{
                                                width: 12, height: 12, borderRadius: 6, backgroundColor: '#3478F6'
                                            }} />
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 16 }} color={colors.text.primary}>{opt.label}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={{ marginTop: 24, backgroundColor: '#3478F6', borderRadius: 24, paddingVertical: 12, alignItems: 'center' }}
                                onPress={() => setShowFilter(false)}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{t('apply')}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
                {/* End Modal filter */}

                <SectionHeader title={t('today')} />

                <MScrollView refreshing={refreshing}
                    style={{ marginTop: 16 }}
                    onRefresh={onRefresh} >
                    {today.map(item => (
                        <NotificationItem key={item.id} item={item} />
                    ))}

                    <SectionHeader title={t('this_week')} />
                    {week.map(item => (
                        <NotificationItem key={item.id} item={item} />
                    ))}

                </MScrollView>
            </VStack>
        </SafeAreaView>
    );
};

export default NotificationScreen;
