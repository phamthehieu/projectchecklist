import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    ButtonText,
    ButtonIcon
} from '@gluestack-ui/themed';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Mail, MoveLeftIcon } from "lucide-react-native";
import { BlurView } from '@react-native-community/blur';
import { OtpInput } from '../../../components/OtpInput';
import { useState, useEffect } from 'react';
import { useAppColorMode } from '../../../components/ColorModeContext';
import { useAppColors } from '../../../../hooks/useAppColors';

const OtpConfirmScreen: React.FC = ({ navigation, route }: any) => {
    const { type } = route.params;
    const { t, i18n } = useTranslation();
    const { colorMode } = useAppColorMode();
    const colors = useAppColors();
    const isDarkMode = colorMode === 'dark';
    const [timeLeft, setTimeLeft] = useState(180); // 3 phút = 180 giây
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleResendOtp = () => {
        // TODO: Thêm logic gửi lại OTP ở đây
        setTimeLeft(180);
        setCanResend(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <BlurView
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                blurType={isDarkMode ? "dark" : "light"}
                blurAmount={10}
            />

            <Box
                bg={colors.background.card}
                borderRadius={20}
                shadowOpacity={6}
                w="100%"
                maxWidth={350}
                mt={40}
                mb={40}
                p={24}
            >
                <Button
                    size="md"
                    variant="outline"
                    action="primary"
                    w={60}
                    h={40}
                    borderRadius={10}
                    borderColor={colors.input.border}
                    ml={-16}
                    mb={16}
                    onPress={() => navigation.goBack()}
                >
                    <ButtonIcon as={MoveLeftIcon} size="xl" color={colors.text.primary} />
                </Button>
                <Text textAlign="left" mb={4} fontSize={28} fontWeight="bold" color={colors.text.primary}>
                    {t("otp_code")}
                </Text>
                <HStack justifyContent="flex-start" mb={4}>
                    <Text color={colors.text.secondary} fontSize={12}>{t("enter_otp_code")} </Text>
                </HStack>
                <VStack space="3xl" mt={16}>
                    <OtpInput
                        textProps={{
                            style: {
                                color: colors.text.primary,
                            },
                        }}
                        numberOfDigits={5}
                        onTextChange={(text) => console.log(text)}
                    />
                </VStack>
                <HStack justifyContent="center" marginVertical={28}>
                    {!canResend ? (
                        <Text color={colors.text.secondary} fontSize={14}>
                            {t("resend_code_in")} <Text color={colors.primary.main} fontSize={14}>{formatTime(timeLeft)}</Text>
                        </Text>
                    ) : (
                        <Button
                            variant="link"
                            onPress={handleResendOtp}
                        >
                            <ButtonText color={colors.primary.main}>{t("resend_code")}</ButtonText>
                        </Button>
                    )}
                </HStack>
                {type === "forgot_password" ?
                    <Button
                        size="xl"
                        mt={16}
                        borderRadius={10}
                        bg={colors.button.primary.background}
                        onPress={() => {
                            setTimeout(() => {
                                navigation.replace('ResetPasswordScreens');
                            }, 100);
                        }}
                    >
                        <ButtonText color={colors.button.primary.text}>{t("continue")}</ButtonText>
                    </Button>
                    :
                    <Button
                        size="xl"
                        mt={16}
                        borderRadius={10}
                        bg={colors.button.primary.background}
                        onPress={() => {
                            setTimeout(() => {
                                navigation.goBack();
                            }, 100);
                        }}
                    >
                        <ButtonText color={colors.button.primary.text}>{t("complete")}</ButtonText>
                    </Button>
                }
            </Box>
        </View>
    );
};

export default OtpConfirmScreen;

