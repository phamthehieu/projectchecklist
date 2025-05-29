import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    Pressable,
    InputIcon,
    InputField,
    InputSlot,
    Button,
    ButtonText,
    EyeIcon,
    ScrollView,
    ButtonIcon
} from '@gluestack-ui/themed';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyRoundIcon, Mail, EyeClosedIcon, MoveLeftIcon, UserRoundPenIcon, Cake, Phone, MapPin, UserCog } from "lucide-react-native";
import { useState } from 'react';
import { BlurView } from '@react-native-community/blur';
import { useAppColorMode } from '../../../components/ColorModeContext';
import { useAppColors } from '../../../../hooks/useAppColors';

const RegisterScreen: React.FC = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
    const { colorMode } = useAppColorMode();
    const colors = useAppColors();
    const isDarkMode = colorMode === 'dark';
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.modal }}>
            <ScrollView>
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
                        {t("signup")}
                    </Text>
                    <HStack justifyContent="flex-start" mb={4}>
                        <Text color={colors.text.secondary} fontSize={12}>{t("slogen_signup")} </Text>
                    </HStack>
                    <VStack space="3xl" mt={16}>
                        <HStack space="md" alignItems="center">
                            <Input size="xl" borderRadius={10} flex={1} bg={colors.input.background}>
                                <InputSlot pl={12}>
                                    <InputIcon as={UserRoundPenIcon} size="lg" color={colors.input.placeholder} />
                                </InputSlot>
                                <InputField focusable={true} color={colors.input.text} placeholder={t("last_name")} fontSize={14} />
                            </Input>
                            <Input size="xl" borderRadius={10} flex={1} bg={colors.input.background}>
                                <InputSlot pl={12}>
                                    <InputIcon as={UserRoundPenIcon} size="lg" color={colors.input.placeholder} />
                                </InputSlot>
                                <InputField focusable={true} color={colors.input.text} placeholder={t("first_name")} fontSize={14} />
                            </Input>
                        </HStack>
                        <HStack space="md" alignItems="center">
                            <Input size="xl" borderRadius={10} flex={1} bg={colors.input.background}>
                                <InputSlot pl={12}>
                                    <InputIcon as={Cake} size="lg" color={colors.input.placeholder} />
                                </InputSlot>
                                <InputField focusable={true} color={colors.input.text} placeholder={t("date_of_birth")} fontSize={14} />
                            </Input>
                            <Input size="xl" borderRadius={10} flex={1} bg={colors.input.background}>
                                <InputSlot pl={12}>
                                    <InputIcon as={UserCog} size="lg" color={colors.input.placeholder} />
                                </InputSlot>
                                <InputField focusable={true} color={colors.input.text} placeholder={t("gender")} fontSize={14} />
                            </Input>
                        </HStack>
                        <Box>
                            <Input size="xl" borderRadius={10} bg={colors.input.background}>
                                <InputSlot pl={12}>
                                    <InputIcon as={Phone} size="lg" color={colors.input.placeholder} />
                                </InputSlot>
                                <InputField focusable={true} color={colors.input.text} placeholder={t("phone")} fontSize={14} />
                            </Input>
                        </Box>
                        <Box>
                            <Input size="xl" borderRadius={10} bg={colors.input.background}>
                                <InputSlot pl={12}>
                                    <InputIcon as={MapPin} size="lg" color={colors.input.placeholder} />
                                </InputSlot>
                                <InputField focusable={true} color={colors.input.text} placeholder={t("address")} fontSize={14} />
                            </Input>
                        </Box>
                        <Box>
                            <Input size="xl" borderRadius={10} bg={colors.input.background}>
                                <InputSlot pl={12}>
                                    <InputIcon as={Mail} size="lg" color={colors.input.placeholder} />
                                </InputSlot>
                                <InputField focusable={true} color={colors.input.text} placeholder={t("login_with_email")} fontSize={14} />
                            </Input>
                        </Box>
                        <Box>
                            <Input size="xl" borderRadius={10} bg={colors.input.background}>
                                <InputSlot pl={12}>
                                    <InputIcon as={KeyRoundIcon} size="lg" color={colors.input.placeholder} />
                                </InputSlot>
                                <InputField
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t("login_with_password")}
                                    fontSize={14}
                                    color={colors.input.text}
                                />
                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={{ padding: 12 }}
                                >
                                    <InputIcon as={showPassword ? EyeIcon : EyeClosedIcon} color={colors.input.placeholder} />
                                </Pressable>
                            </Input>
                        </Box>
                    </VStack>
                    <Button
                        size="xl"
                        mt={26}
                        borderRadius={10}
                        bg={colors.button.primary.background}
                        onPress={() => {
                            setTimeout(() => {
                                navigation.replace('OtpConfirmScreen', {
                                    type: "register"
                                });
                            }, 100);
                        }}
                    >
                        <ButtonText color={colors.button.primary.text}>{t("signup")}</ButtonText>
                    </Button>
                </Box>
            </ScrollView>
        </View>
    );
};

export default RegisterScreen;

