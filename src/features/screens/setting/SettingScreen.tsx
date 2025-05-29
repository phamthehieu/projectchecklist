import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AvatarComponents from '../../components/Avatar/AvatarComponents';
import { Button, ButtonIcon, Switch } from '@gluestack-ui/themed';
import { useAppColorMode } from '../../components/ColorModeContext';
import { UserRound, Settings as SettingsIcon, LogOut, ArrowRight, Moon, EditIcon, Eraser, Sun, Languages } from 'lucide-react-native';
import { useAppColors } from '../../../hooks/useAppColors';
import { useTranslation } from 'react-i18next';
import appStorage from '../../../repositories/local_storage';
import KeyStoreData from '../../../repositories/local_storage/KeyStoreData';
import LanguageSelect from '../../components/LanguageSelect/LanguageSelect';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SettingScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { colorMode, toggleColorMode } = useAppColorMode();
    const colors = useAppColors();
    const { t, i18n } = useTranslation();

    const user = {
        name: 'Phạm Thế Hiếu',
        email: 'phamthehieu@gmail.com',
        phone: '0962591409',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    };

    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language);
        appStorage.setString(KeyStoreData.LANGUAGE, language);
    };

    const menuItems = [
        { icon: <UserRound color={colors.tailwind.blue[600]} />, label: t('change_password'), onPress: () => { navigation.navigate('ForgotPasswordScreens'); } },
        { icon: <Eraser color={colors.tailwind.orange[300]} />, label: t('disable_account'), onPress: () => { } },
        { icon: <LogOut color={colors.tailwind.red[500]} />, label: t('logout'), onPress: () => { navigation.replace('LoginScreens') } },
    ];

    console.log(i18n.language);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <View style={[styles.profileCard, { backgroundColor: colors.background.card }]}>
                    <AvatarComponents
                        rounded="VStack"
                        size="2xl"
                        url={user.avatar}
                        heading={user.name}
                        title={`${user.email}\n${user.phone}`}
                    />
                    <Button size="lg" rounded={"$full"} bgColor={"transparent"} borderWidth={1} borderColor={"transparent"} top={10} right={1} position={"absolute"} onPress={() => navigation.navigate('UserInformationScreen')}>
                        <ButtonIcon as={EditIcon} size="xl" color={colorMode === 'dark' ? colors.tailwind.white : colors.tailwind.gray[500]} />
                    </Button>
                </View>

                <TouchableOpacity onPress={toggleColorMode} style={[styles.darkMode, { backgroundColor: colors.background.card }]}>
                    <View style={styles.menuLeft}>
                        <View style={styles.iconCircle}>
                            {colorMode === 'dark' ? <Moon color={colors.tailwind.yellow[500]} /> : <Sun color={colors.tailwind.red[500]} />}
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text.primary }]} >{colorMode === 'dark' ? t('dark_mode') : t('light_mode')}</Text>
                    </View>
                    <Switch value={colorMode === 'dark'} onValueChange={toggleColorMode} thumbColor={colors.tailwind.blue[300]} trackColor={{ false: colors.tailwind.gray[300], true: colors.tailwind.blue[200] }} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.darkMode, { backgroundColor: colors.background.card }]}>
                    <View style={styles.menuLeft}>
                        <View style={styles.iconCircle}>
                            <Languages color={colors.tailwind.purple[500]} />
                        </View>
                        <Text style={[styles.menuLabel, { color: colors.text.primary }]} >{t('language')}</Text>
                    </View>
                    <View style={{ width: 150 }}>
                        <LanguageSelect
                            selectedLanguage={i18n.language}
                            onLanguageChange={handleLanguageChange}
                        />
                    </View>
                </TouchableOpacity>


                {menuItems.map((item, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={[styles.darkMode, { backgroundColor: colors.background.card }]}
                        onPress={item.onPress}
                    >
                        <View style={styles.menuLeft}>
                            <View style={styles.iconCircle}>{item.icon}</View>
                            <Text style={[styles.menuLabel, { color: colors.text.primary }]}>{item.label}</Text>
                        </View>
                        <ArrowRight color="#bbb" />
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 10,
        marginTop: 50,
        alignItems: 'center',
        marginBottom: 24,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        justifyContent: 'space-between',
    },
    darkMode: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 10,
        elevation: 2,
        marginTop: 20,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f5f6fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuLabel: {
        fontSize: 16,
    },
});

export default SettingScreen;