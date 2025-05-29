import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import MHeader from '../../../components/header/MHeader';
import AvatarComponents from '../../../components/Avatar/AvatarComponents';
import MTextField from '../../../components/Input/MTextField';
import SelectComponent from '../../../components/Select/SelectComponents';
import ButtonComponents from '../../../components/Button/ButtonComponents';
import TextareaComponent from '../../../components/Textarea/TextareaComponents';
import { useAppColors } from '../../../../hooks/useAppColors';
import { useTranslation } from 'react-i18next';
import { Box, HStack } from '@gluestack-ui/themed';
import CameraComponent from '../../../components/Camera/CameraComponent';
import VideoComponnent from '../../../components/Camera/VideoComponnent';

const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Khác', value: 'other' },
];

const UserInformationScreen = ({ navigation }: any) => {
    const colors = useAppColors();
    const { t, i18n } = useTranslation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const templateText = `Sở thích 1:
Số điện thoại:
Email:
Tuổi:
Giới tính:
Địa chỉ:`;

    const [hobbies, setHobbies] = useState(templateText);

    const handleHobbiesChange = (text: string) => {
        // Kiểm tra nếu text ngắn hơn template thì không cho phép xóa
        if (text.length < templateText.length) {
            return;
        }
        setHobbies(text);
    };

    // Dữ liệu mẫu cho avatar, tên, email
    const user = {
        name: 'Phạm Thế Hiếu',
        email: 'phamthehieu@gmail.com',
        phone: '0962591409',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
            <MHeader label={t('bio_data')} showiconLeft onBack={() => { navigation.goBack() }} />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <AvatarComponents
                        rounded="VStack"
                        size="2xl"
                        url={user.avatar}
                        heading={user.name}
                        title={`${user.email}\n${user.phone}`}
                        showCamera
                    />
                </View>
                <HStack space="md" alignItems="center">
                    <Box flex={1}>
                        <MTextField
                            placeholder={t('what_is_your_first_name')}
                            showLabel
                            value={firstName}
                            label={t('first_name')}
                            onChangeText={setFirstName}
                            containerStyle={{ marginBottom: 18 }}
                        />
                    </Box>
                    <Box flex={1}>
                        <MTextField
                            placeholder={t('what_is_your_last_name')}
                            value={lastName}
                            label={t('last_name')}
                            onChangeText={setLastName}
                            showLabel
                            containerStyle={{ marginBottom: 18 }}
                        />
                    </Box>
                </HStack>

                <MTextField
                    placeholder={t('what_is_your_phone_number')}
                    value={phone}
                    label={t('phone')}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    showLabel
                    containerStyle={{ marginBottom: 18 }}
                />
                <SelectComponent
                    options={genderOptions}
                    placeholder={t('what_is_your_gender')}
                    label={t('gender')}
                    selectedValue={genderOptions.find(g => g.value === gender)}
                    onValueChange={setGender}
                />
                <MTextField
                    placeholder={t('what_is_your_date_of_birth')}
                    value={dob}
                    label={t('date_of_birth')}
                    onChangeText={setDob}
                    showLabel
                    containerStyle={{ marginTop: 18 }}
                />
                <MTextField
                    placeholder={t('what_is_your_address')}
                    value={address}
                    label={t('address')}
                    onChangeText={setAddress}
                    showLabel
                    containerStyle={{ marginTop: 18 }}
                />
                <TextareaComponent
                    label={t('hobbies')}
                    placeholder={t('what_are_your_hobbies')}
                    value={hobbies}
                    onChangeText={handleHobbiesChange}
                    template={templateText}
                    templateFields={[
                        { label: "Sở thích 1", type: "text", required: true },
                        { label: "Số điện thoại", type: "phone" },
                        { label: "Email", type: "email" },
                        { label: "Tuổi", type: "number" },
                    ]}
                    onValidationError={(errors) => {
                        console.log('Validation errors:', errors);
                    }}
                    containerStyle={{ marginTop: 18, marginBottom: 24 }}
                    textareaInputProps={{
                        style: {
                            fontSize: 16,
                            lineHeight: 24,
                        }
                    }}
                />

                <Box marginVertical={18}>
                    <CameraComponent />
                </Box>

                <Box marginVertical={18}>
                    <VideoComponnent />
                </Box>

            </ScrollView>
            <Box padding={20}>
                <ButtonComponents
                    marginTop={10}
                    type="save"
                    title={t('update_profile')}
                    size="xl"
                    variant="solid"
                    action="primary"
                    onPress={() => { }}
                />
            </Box>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 10,
        flexGrow: 1,
        paddingBottom: 50,
    },
});

export default UserInformationScreen;
