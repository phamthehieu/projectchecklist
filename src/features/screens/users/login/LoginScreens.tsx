import React, { useEffect, useState } from "react";
import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    Pressable,
    Checkbox,
    InputIcon,
    InputField,
    InputSlot,
    ScrollView,
    CheckboxIndicator,
    CheckboxLabel,
    Button,
    ButtonText,
    ButtonIcon,
} from '@gluestack-ui/themed';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import { Image, StatusBar, NativeModules } from "react-native";
import { EyeClosedIcon, EyeIcon, KeyRoundIcon, Mail, FingerprintIcon } from "lucide-react-native";
import { useTranslation } from 'react-i18next';
import Toast from "react-native-toast-message";
import appStorage from "../../../../repositories/local_storage";
import KeyStoreData from "../../../../repositories/local_storage/KeyStoreData";
import { useAppColorMode } from "../../../components/ColorModeContext";
import { useAppColors } from "../../../../hooks/useAppColors";
import DeviceInfo from "react-native-device-info";
import axios from "axios";
import moment from "moment";
import uuid from 'react-native-uuid';
import { fonts } from "../../../../theme/fonts";

const { ForegroundService } = NativeModules;

type ForegroundServiceParams = {
    id_TaiKhoan: string;
    id_PhuongTien: string;
    userName: string;
    authToken: string;
    refreshToken: string;
    baseUrl: string;
};


const LoginScreens: React.FC = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
    const { colorMode } = useAppColorMode();
    const colors = useAppColors();
    const isDarkMode = colorMode === 'dark';
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [email, setEmail] = useState("nvnga");
    const [password, setPassword] = useState("1");

    const validateEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        // try {
        // const uniqueId = await DeviceInfo.getUniqueId();
        // const payload = {
        //     UserName: email,
        //     Password: password,
        //     OS: DeviceInfo.getSystemName() == 'Android' ? '1' : '2',
        //     OS_Version: DeviceInfo.getSystemVersion(),
        //     Model: DeviceInfo.getDeviceNameSync(),
        //     Brand: DeviceInfo.getSystemName(),
        //     Imei: uniqueId,
        //     App_Version: DeviceInfo.getVersion(),
        //     RequestId: '',
        //     ID_Push: "aaaaasdfgh",
        // };

        // const config = {
        //     method: 'post',
        //     url: 'http://dev.lachongtech.vn:8718/api/login/login-app',
        //     headers: {
        //         'x-requestid': '""',
        //         'Content-Type': 'application/json'
        //     },
        //     data: payload
        // };

        // const response = await axios(config);

        // if (response.data.IsSuccess) {
        //     const data = response.data.Value;
        //     console.log(data);
        //     startGPSService({
        //         id_TaiKhoan: data.ID_TaiKhoan,
        //         id_PhuongTien: data.ID_PhuongTien,
        //         userName: data.UserName,
        //         authToken: data.AuthToken,
        //         refreshToken: data.RefreshToken,
        //         baseUrl: "http://dev.lachongtech.vn:8718",
        //     });

        navigation.replace('BottomBarScreen');

        //     } else {
        //         // Sai tài khoản/mật khẩu, báo lỗi
        //         Toast.show({
        //             type: 'error',
        //             text1: 'Đăng nhập thất bại!',
        //             text2: response.data.msg || 'Sai tài khoản hoặc mật khẩu.'
        //         });
        //     }

        // } catch (error) {
        //     console.log("error", error);
        //     Toast.show({
        //         type: 'error',
        //         text1: 'Lỗi kết nối với server!',
        //         text2: `Xin vui lòng kiểm tra lại đường truyền mạng và thử lại.`,
        //     });
        // } finally {
        //     // Nếu muốn làm gì sau khi xong, ví dụ tắt loading
        // }
    }

    const startGPSService = async ({
        id_TaiKhoan,
        id_PhuongTien,
        userName,
        authToken,
        baseUrl,
        refreshToken,
    }: ForegroundServiceParams) => {
        const time = moment().format('YYYY-MM-DD HH:mm:ss').toString() + 'Z';
        const batteryLevel = Math.floor(DeviceInfo.getBatteryLevelSync() * 100);

        // await requestBackgroundLocationPermission();

        ForegroundService.startService(
            uuid.v4() + '',
            id_TaiKhoan,
            id_PhuongTien,
            userName,
            batteryLevel,
            time,
            authToken,
            refreshToken,
            baseUrl,
        );
    };

    useEffect(() => {
        const getLoginCredentials = async () => {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                setEmail(credentials.username);
                setPassword(credentials.password);
            }
            setRemember(appStorage.getBool(KeyStoreData.REMEMBER));
        }
        getLoginCredentials()
    }, [])

    return (
        <LinearGradient
            colors={[colors.background.primary, colors.primary.main]}
            locations={[0.5, 1]}
            style={{ flex: 1 }}
        >
            <StatusBar
                translucent
                backgroundColor={colors.background.primary}
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            <ScrollView>
                <VStack flex={1} alignItems="center" px={16}>
                    <Box mb={6} mt={50}>
                        <Image
                            alt="logo"
                            source={require("../../../../assets/image/lh_logo.png")}
                            style={{ width: 140, height: 100, resizeMode: 'contain', backgroundColor: "transparent" }}
                        />
                    </Box>
                    <Box
                        bg={colors.background.card}
                        borderRadius={20}
                        shadowOpacity={6}
                        w="100%"
                        maxWidth={350}
                        mb={40}
                        p={16}
                    >
                        <Text textAlign="center" mb={4} fontSize={28} fontWeight="bold" color={colors.text.primary} fontFamily={fonts.inter.bold}>
                            {t("login")}
                        </Text>
                        <HStack justifyContent="center" mb={4}>
                            <Text color={colors.text.secondary} fontSize={12} >{t("title_signup")} </Text>
                            <Pressable onPress={() => {
                                setTimeout(() => {
                                    navigation.navigate('RegisterScreen');
                                }, 100);
                            }}>
                                <Text color={colors.primary.main} fontSize={12} fontWeight="bold"> {t("signup")}</Text>
                            </Pressable>
                        </HStack>
                        <VStack space="3xl" mt={34}>
                            <Box>
                                <Text mb={2} fontSize={14} color={colors.text.secondary}>{t("email")}</Text>
                                <Input size="xl" borderRadius={10} bg={colors.input.background}>
                                    <InputSlot pl={12}>
                                        <InputIcon as={Mail} size="lg" color={colors.input.placeholder} />
                                    </InputSlot>
                                    <InputField focusable={true} keyboardType="email-address" color={colors.input.text} placeholder={t("login_with_email")} fontSize={14} onChangeText={setEmail} value={email} autoCapitalize="none" />
                                </Input>
                            </Box>
                            <VStack space="xs">
                                <Text mb={2} fontSize={14} color={colors.text.secondary}>{t("password")}</Text>
                                <Input size="xl" borderRadius={10} bg={colors.input.background}>
                                    <InputSlot pl={12}>
                                        <InputIcon as={KeyRoundIcon} size="lg" color={colors.input.placeholder} />
                                    </InputSlot>
                                    <InputField type={showPassword ? "text" : "password"} placeholder={t("login_with_password")} fontSize={14} onChangeText={setPassword} value={password} autoCapitalize="none" color={colors.input.text} />
                                    <Pressable
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={{ padding: 12 }}
                                    >
                                        <InputIcon as={showPassword ? EyeIcon : EyeClosedIcon} color={colors.input.placeholder} />
                                    </Pressable>
                                </Input>
                            </VStack>
                        </VStack>
                        <HStack alignItems="center" justifyContent="space-between" mt={36}>
                            <Checkbox value="Eng" onPress={() => setRemember(!remember)}>
                                <CheckboxIndicator bgColor={remember ? colors.primary.main : colors.background.primary} borderColor={remember ? colors.primary.main : colors.input.border}>
                                    {/* <CheckboxIcon as={CheckIcon} color={colors.text.primary} size="lg" /> */}
                                </CheckboxIndicator>
                                <CheckboxLabel ml={8} fontSize={14} color={colors.text.primary}>{t("remember_me")}</CheckboxLabel>
                            </Checkbox>
                            <Pressable onPress={() => {
                                setTimeout(() => {
                                    navigation.navigate('ForgotPasswordScreens');
                                }, 100);
                            }}>
                                <Text color={colors.primary.main} fontWeight="bold" fontSize={14}>{t("forgot_password")}</Text>
                            </Pressable>
                        </HStack>
                        <HStack alignItems="center" justifyContent="space-between" my={4} mt={16}>
                            <Button size="xl" mt={26} borderRadius={10} bg={colors.button.primary.background} flex={1} mr={4} onPress={handleLogin}>
                                <ButtonText color={colors.button.primary.text}>{t("login")}</ButtonText>
                            </Button>
                            <Button size="xl" mt={26} borderRadius={10} bg={colors.button.primary.background} ml={4}>
                                <ButtonIcon as={FingerprintIcon} size="xl" color={colors.button.primary.text} />
                            </Button>
                        </HStack>

                        {/* <HStack alignItems="center" mb={3} mt={24}>
                            <Divider flex={1} />
                            <Text mx={2} color="$muted400">{t("or")}</Text>
                            <Divider flex={1} />
                        </HStack>
                        <Button size="xl" mt={24} borderRadius={10} variant="outline" borderColor={colors.gray[400]} flexDirection="row" alignItems="center">
                            <Image
                                source={require("../../../../assets/image/google.png")}
                                style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8 }}
                            />
                            <ButtonText color={colors.black} fontSize={14}>{t("continue_with_google")}</ButtonText>
                        </Button>
                        <Button size="xl" mt={24} borderRadius={10} variant="outline" borderColor={colors.gray[400]} flexDirection="row" alignItems="center">
                            <Image
                                source={require("../../../../assets/image/Facebook.png")}
                                style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 8 }}
                            />
                            <ButtonText color={colors.black} fontSize={14}>{t("continue_with_facebook")}</ButtonText>
                        </Button> */}
                    </Box>
                </VStack>
            </ScrollView>
        </LinearGradient>
    )
}

export default LoginScreens;