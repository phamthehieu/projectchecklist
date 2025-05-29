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
    CheckboxIcon,
    CheckboxLabel,
    Button,
    ButtonText,
    ButtonIcon,
    useColorMode,
} from '@gluestack-ui/themed';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import { Image, StatusBar } from "react-native";
import { CheckIcon, EyeClosedIcon, EyeIcon, KeyRoundIcon, Mail, FingerprintIcon } from "lucide-react-native";
import { useTranslation } from 'react-i18next';
import Toast from "react-native-toast-message";
import appStorage from "../../../../repositories/local_storage";
import KeyStoreData from "../../../../repositories/local_storage/KeyStoreData";
import { useAppColorMode } from "../../../components/ColorModeContext";
import { useAppColors } from "../../../../hooks/useAppColors";

const LoginScreens: React.FC = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
    const { colorMode } = useAppColorMode();
    const colors = useAppColors();
    const isDarkMode = colorMode === 'dark';
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("123456");

    const validateEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        if (email === "") {
            Toast.show({
                type: "error",
                text1: t("error"),
                text2: t("error_email_required")
            });
            return;
        }

        if (password === "") {
            Toast.show({
                type: "error",
                text1: t("error"),
                text2: t("error_password_required")
            });
            return;
        }

        if (!validateEmail(email)) {
            Toast.show({
                type: "error",
                text1: t("error"),
                text2: t("error_email")
            });
            return;
        }

        if (password.length < 6) {
            Toast.show({
                type: "error",
                text1: t("error"),
                text2: t("error_password")
            });
            return;
        }

        if (email === "admin@gmail.com" && password === "123456") {
            if (remember) {
                await saveLoginCredentials(email, password);
                appStorage.setBool(KeyStoreData.REMEMBER, true);
            } else {
                await Keychain.resetGenericPassword();
                appStorage.setBool(KeyStoreData.REMEMBER, false);
            }
            Toast.show({
                type: "success",
                text1: t("success"),
                text2: t("login_success")
            });
            navigation.replace('BottomBarScreen');
        }
    }

    const saveLoginCredentials = async (username: string, password: string) => {
        try {
            await Keychain.setGenericPassword(username, password);
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Đã xảy ra lỗi!',
                text2: 'Không thể lưu thông tin đăng nhập!',
                visibilityTime: 1400
            });
        }
    }

    const changeLanguage = (language: string) => {
        i18n.changeLanguage(language);
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
                        <Text textAlign="center" mb={4} fontSize={28} fontWeight="bold" color={colors.text.primary}>
                            {t("login")}
                        </Text>
                        <HStack justifyContent="center" mb={4}>
                            <Text color={colors.text.secondary} fontSize={12}>{t("title_signup")} </Text>
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