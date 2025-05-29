import React, { useEffect, useRef } from 'react';
import { GluestackUIProvider, Box, ScrollView, HStack, Button, ButtonText, Center, Heading } from '@gluestack-ui/themed';
import { config } from '../../../../gluestack-ui.config';
import { ColorModeProvider, useAppColorMode } from '../../components/ColorModeContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../../translations/i18n'; // Adjust the path to your i18n configuration file
import ListImageComponents from '../Images/ListImageComponents';
import { requestMediaLibraryPermission, setupPermissions } from '../../components/Permission';
import LoginScreens from '../users/login/LoginScreens';
import RegisterScreen from '../users/register/RegisterScreen';
import ForgotPasswordScreens from '../users/forgotPassword/ForgotPasswordScreens';
import OtpConfirmScreen from '../users/forgotPassword/OtpConfirmScreen';
import ResetPasswordScreens from '../users/forgotPassword/ResetPasswordScreens';
import { ToastProvider } from '../../components/toast/ToastProvider';
import BottomBarScreen from '../BottomBar/BottomBarScreen';
import UserInformationScreen from '../users/userInformation/UserInformationScreen';
import CheckListTotalScreen from '../checkList/CheckListTotalScreen';
import NotificationScreen from '../notifications/NotificationScreen';
import { NetworkProvider } from '../../../contexts/NetworkContext';
import { NetworkStatus } from '../../components/NetworkStatus/NetworkStatus';
import QrCodeComponent from '../../components/Camera/QrCodeComponent';
import { useAppColors } from '../../../hooks/useAppColors';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <GluestackUIProvider config={config}>
      <I18nextProvider i18n={i18n}>
        <ColorModeProvider>
          <NetworkProvider>
            <MainScreen />
            <ToastProvider />
          </NetworkProvider>
        </ColorModeProvider>
      </I18nextProvider>
    </GluestackUIProvider>
  );
}

export default App;

function MainScreen() {
  const navigationApp = useRef<any>(null);
  const colors = useAppColors();

  useEffect(() => {
    // requestMediaLibraryPermission()
    setupPermissions()
  }, [])

  return (
    <NavigationContainer ref={navigationApp}>
      <Box flex={1} bg={colors.background.primary}>
        <NetworkStatus />
        <Stack.Navigator
          initialRouteName="LoginScreens"
          screenOptions={{
            contentStyle: {
              backgroundColor: colors.background.primary
            }
          }}
        >
          <Stack.Screen
            component={LoginScreens}
            name='LoginScreens'
            options={{ headerShown: false }}
          />

          <Stack.Screen
            component={BottomBarScreen}
            name='BottomBarScreen'
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'none',
            }}
          />

          <Stack.Screen
            name="ForgotPasswordScreens"
            component={ForgotPasswordScreens}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'none',
            }}
          />

          <Stack.Screen
            name="ResetPasswordScreens"
            component={ResetPasswordScreens}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'none',
            }}
          />

          <Stack.Screen
            name="OtpConfirmScreen"
            component={OtpConfirmScreen}
            options={{
              headerShown: false,
              presentation: 'transparentModal',
              animation: 'none',
            }}
          />

          <Stack.Screen
            component={ListImageComponents}
            name="ListImageComponents"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            component={UserInformationScreen}
            name="UserInformationScreen"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            component={CheckListTotalScreen}
            name="CheckListTotalScreen"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            component={NotificationScreen}
            name="NotificationScreen"
            options={{ headerShown: false }}
          />

          <Stack.Screen
            component={QrCodeComponent}
            name="QrCodeComponent"
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </Box>
    </NavigationContainer>
  );
}
