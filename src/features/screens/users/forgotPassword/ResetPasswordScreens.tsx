import {
    Box,
    VStack,
    HStack,
    Text,
    Input,
    InputIcon,
    InputField,
    InputSlot,
    Button,
    ButtonText,
    ButtonIcon
} from '@gluestack-ui/themed';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KeyRoundIcon, MoveLeftIcon, RotateCcwIcon } from "lucide-react-native";
import { BlurView } from '@react-native-community/blur';
import { useAppColorMode } from '../../../components/ColorModeContext';
import { useAppColors } from '../../../../hooks/useAppColors';

const ResetPasswordScreens: React.FC = ({ navigation }: any) => {
    const { t, i18n } = useTranslation();
    const { colorMode } = useAppColorMode();
    const colors = useAppColors();
    const isDarkMode = colorMode === 'dark';

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
                    {t("reset_password")}
                </Text>
                <HStack justifyContent="flex-start" mb={4}>
                    <Text color={colors.text.secondary} fontSize={12}>{t("slogen_reset_password")} </Text>
                </HStack>
                <VStack space="3xl" mt={16}>
                    <Box>
                        <Input size="xl" borderRadius={10} bg={colors.input.background}>
                            <InputSlot pl={12}>
                                <InputIcon as={KeyRoundIcon} size="lg" color={colors.input.placeholder} />
                            </InputSlot>
                            <InputField
                                focusable={true}
                                color={colors.input.text}
                                placeholder={t("new_password")}
                                fontSize={14}
                            />
                        </Input>
                    </Box>
                    <Box>
                        <Input size="xl" borderRadius={10} bg={colors.input.background}>
                            <InputSlot pl={12}>
                                <InputIcon as={RotateCcwIcon} size="lg" color={colors.input.placeholder} />
                            </InputSlot>
                            <InputField
                                focusable={true}
                                color={colors.input.text}
                                placeholder={t("confirm_password")}
                                fontSize={14}
                            />
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
                            navigation.goBack();
                        }, 100);
                    }}
                >
                    <ButtonText color={colors.button.primary.text}>{t("complete")}</ButtonText>
                </Button>
            </Box>
        </View>
    );
};

export default ResetPasswordScreens;

