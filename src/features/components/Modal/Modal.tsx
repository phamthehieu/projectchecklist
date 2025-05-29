import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Button, Heading, Image, Modal, ModalBackdrop, ModalBody, ModalContent, ModalFooter, Text, ButtonText } from '@gluestack-ui/themed';
import { useAppColorMode } from '../ColorModeContext';

const { width, height } = Dimensions.get('window');

interface IProps {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
    imageUrl?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryButtonPress?: () => void;
    onSecondaryButtonPress?: () => void;
    showImage?: boolean;
    showSecondaryButton?: boolean;
}

const ModalComponent: React.FC<IProps> = ({
    isOpen,
    onClose,
    title = "Welcome to the dashboard",
    description = "We are glad to have you on board, Here are some quick tips to let you up and running.",
    imageUrl = "https://gluestack.github.io/public-blog-video-assets/Image%20Element.png",
    primaryButtonText = "Next",
    secondaryButtonText = "Skip",
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    showImage = true,
    showSecondaryButton = true,
}) => {

    const { colorMode } = useAppColorMode();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalBackdrop />

            <ModalContent maxWidth={"96%"} bgColor={colorMode == "dark" ? "$backgroundDarkModal" : "$backgroundLight50"}>

                {showImage && (
                    <Image

                        source={{
                            uri: imageUrl,
                        }}
                        alt="image"
                        height={156}
                        w={"$full"}
                    />
                )}

                <ModalBody mb={"$5"}>
                    <Heading size='md' textAlign='center' mt={"$5"} color={colorMode == "dark" ? "$textLight50" : "$textDark950"}>
                        {title}
                    </Heading>

                    <Text size='sm' textAlign='center' color={colorMode == "dark" ? "$textLight50" : "$textDark950"}>
                        {description}
                    </Text>
                </ModalBody>

                <ModalFooter w={"$full"}>
                    {showSecondaryButton && (
                        <Button
                            variant="outline"
                            action="secondary"
                            size="sm"
                            onPress={onSecondaryButtonPress || onClose}
                            mr="$4"
                        >
                            <ButtonText color={colorMode == "dark" ? "$textLight50" : "$textDark950"}>
                                {secondaryButtonText}
                            </ButtonText>
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        action="secondary"
                        size="sm"
                        onPress={onPrimaryButtonPress || onClose}
                    >
                        <ButtonText color={colorMode == "dark" ? "$textLight50" : "$textDark950"}>
                            {primaryButtonText}
                        </ButtonText>
                    </Button>
                </ModalFooter>

            </ModalContent>

        </Modal>
    );
};

export default ModalComponent;

const styles = StyleSheet.create({
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        minWidth: 100,
        borderRadius: 12,
        maxWidth: (width * 2) / 3,
    },
});

