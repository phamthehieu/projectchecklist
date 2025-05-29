import React from 'react';
import {
    AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, Icon, Heading,
    AlertDialogBody, AlertDialogFooter, Button, ButtonText, Text, Box
} from '@gluestack-ui/themed';

import { CheckCheck, Trash2 } from "lucide-react-native";

interface MAlertProps {
    visible: boolean;
    title?: string;
    message?: string;
    okText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    showConfirm?: boolean;
    typeAlert: "Confirm" | "Delete";
}

const MAlert: React.FC<MAlertProps> = ({
    visible,
    title,
    message,
    okText,
    cancelText,
    onConfirm,
    onCancel,
    typeAlert
}) => {
    return (
        <AlertDialog
            isOpen={visible}
            onClose={onCancel}
            closeOnOverlayClick={false}
        >
            <AlertDialogBackdrop />

            <AlertDialogContent w="90%" p="$4" alignItems="center">
                {typeAlert === "Delete" ? (
                    <Box
                        w={52}
                        h={52}
                        bg="$error100"
                        rounded="$full"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Icon as={Trash2} size="lg" color="$error500" />
                    </Box>
                ) : (
                    <Box
                        w={52}
                        h={52}
                        bg="$success100"
                        rounded="$full"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Icon as={CheckCheck} size="lg" color="$success500" />
                    </Box>
                )}

                <AlertDialogHeader>
                    <Heading size="md">{title}</Heading>
                </AlertDialogHeader>

                <AlertDialogBody>
                    <Text size="sm" textAlign="center">
                        {message}
                    </Text>
                </AlertDialogBody>

                <AlertDialogFooter mt="$1" flexDirection="row">
                    <Button
                        size="sm"
                        variant="outline"
                        action="secondary"
                        px="$6"
                        flex={1}
                        justifyContent="center"
                        onPress={onCancel}
                    >
                        <ButtonText textAlign="center">{cancelText}</ButtonText>
                    </Button>

                    <Button
                        size="sm"
                        action={typeAlert === "Delete" ? "negative" : "positive"}
                        px="$6"
                        flex={1}
                        ml="$3"
                        justifyContent="center"
                        onPress={onConfirm}
                    >
                        <ButtonText textAlign="center">{okText}</ButtonText>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default MAlert;