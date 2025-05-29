import { NativeModules, Platform } from "react-native";

const LINKING_ERROR =
    `The package 'react-native-qr-code-image-scan' doesn't seem to be linked. Make sure: \n\n` +
    Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
    "- You rebuilt the app after installing the package\n" +
    "- You are not using Expo Go\n";

const QrCodeImageScan = NativeModules.QrCodeImageScan
    ? NativeModules.QrCodeImageScan
    : new Proxy(
        {},
        {
            get() {
                throw new Error(LINKING_ERROR);
            },
        }
    );

export function scanFromPath(path: string): Promise<string[]> {
    return QrCodeImageScan.scanFromPath(path);
}