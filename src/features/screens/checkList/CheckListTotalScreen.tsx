import React, { useState } from 'react';
import { ScrollView, SafeAreaView } from '@gluestack-ui/themed';
import { Platform, RefreshControl, StatusBar } from 'react-native';
import MHeader from '../../components/header/MHeader';
import { useAppColors } from '../../../hooks/useAppColors';
import { useTranslation } from 'react-i18next';
import { TabBar } from './components/TabBarComponent';
import { ProjectCard } from './components/ProjectCardComponent';
import MScrollView from '../../components/ScrollView/MScrollView';

const projects = [
    {
        title: 'Tiki Mobile App Project',
        description: 'UI Kit Design Project - Dec 20, 2024',
        progress: 80,
        total: 90,
        daysLeft: 8,
        color: '#3B82F6',
    },
    {
        title: 'Food Delivery App',
        description: 'External Client Project - Dec 31, 2024',
        progress: 65,
        total: 83,
        daysLeft: 19,
        color: '#F87171',
    },
    {
        title: '3D Education Pack Kit',
        description: 'Internal Team Project - Jan 06, 2025',
        progress: 44,
        total: 79,
        daysLeft: 25,
        color: '#22C55E',
    },
    {
        title: 'Online Course Project',
        description: 'Steam Game Project - Jan 11, 2025',
        progress: 68,
        total: 96,
        daysLeft: 30,
        color: '#FACC15',
    },
];

const CheckListTotalScreen = ({ navigation }: any) => {
    const colors = useAppColors();
    const { t } = useTranslation();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }

    return (
        <SafeAreaView flex={1} bg={colors.background.primary} pt={Platform.OS === 'android' ? StatusBar.currentHeight : 0}>
            <MHeader label={t('check_list')} showiconLeft onBack={() => { navigation.goBack() }} />
            <TabBar tabs={[t('all'), t('on_progress'), t('completed'), t('reject')]} />
            <MScrollView
                refreshing={refreshing}
                onRefresh={onRefresh}
            >
                {projects.map((project, idx) => (
                    <ProjectCard
                        key={idx}
                        title={project.title}
                        description={project.description}
                        progress={project.progress}
                        total={project.total}
                        daysLeft={project.daysLeft}
                        color={project.color}
                    />
                ))}
            </MScrollView>
        </SafeAreaView>
    );
};

export default CheckListTotalScreen;
