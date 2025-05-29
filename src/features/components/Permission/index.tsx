import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import { requestMultiple } from 'react-native-permissions';
const osVersion = Platform.Version;

export const setupPermissions = async () => {
    await requestPermissionsAndroid();
};


export const requestMediaLibraryPermission = async () => {
    try {
        // Trên Android, cần yêu cầu quyền rõ ràng
        if (Platform.OS === 'android') {
            // Kiểm tra phiên bản Android để chọn quyền phù hợp
            if (Platform.Version >= 33) {
                // Android 13+ (API 33+) sử dụng READ_MEDIA_IMAGES
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    {
                        title: 'Quyền truy cập thư viện ảnh',
                        message: 'Ứng dụng cần quyền truy cập vào thư viện ảnh để bạn có thể chọn ảnh',
                        buttonNeutral: 'Hỏi lại sau',
                        buttonNegative: 'Từ chối',
                        buttonPositive: 'Đồng ý',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Đã được cấp quyền truy cập thư viện ảnh');
                    return true;
                } else {
                    console.log('Quyền truy cập thư viện ảnh bị từ chối');

                    // Hiển thị thông báo nếu người dùng từ chối
                    Alert.alert(
                        'Quyền truy cập bị từ chối',
                        'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này. Vui lòng vào Cài đặt > Ứng dụng > [Tên ứng dụng] > Quyền để cấp quyền.',
                        [
                            { text: 'Đã hiểu', style: 'cancel' }
                        ]
                    );

                    return false;
                }
            } else {
                // Android 12 trở xuống sử dụng READ_EXTERNAL_STORAGE
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    {
                        title: 'Quyền truy cập thư viện ảnh',
                        message: 'Ứng dụng cần quyền truy cập vào thư viện ảnh để bạn có thể chọn ảnh',
                        buttonNeutral: 'Hỏi lại sau',
                        buttonNegative: 'Từ chối',
                        buttonPositive: 'Đồng ý',
                    }
                );

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Đã được cấp quyền truy cập thư viện ảnh');
                    return true;
                } else {
                    console.log('Quyền truy cập thư viện ảnh bị từ chối');

                    // Hiển thị thông báo nếu người dùng từ chối
                    Alert.alert(
                        'Quyền truy cập bị từ chối',
                        'Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này. Vui lòng vào Cài đặt > Ứng dụng > [Tên ứng dụng] > Quyền để cấp quyền.',
                        [
                            { text: 'Đã hiểu', style: 'cancel' }
                        ]
                    );

                    return false;
                }
            }
        }
        // Trên iOS không cần yêu cầu quyền theo cách này
        // iOS sẽ tự hiển thị hộp thoại yêu cầu quyền khi bạn sử dụng thư viện
        else {
            return true;
        }
    } catch (error) {
        console.error('Lỗi khi yêu cầu quyền:', error);
        return false;
    }
};

export const requestBackgroundLocationPermission = async () => {
    let backgroundPerrmission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    if (Platform.OS === 'ios' || backgroundPerrmission) return true; // Nếu đã có quyền truy cập GPS dưới nền hoặc là ios thì return true

    let androidApiLevel = await DeviceInfo.getApiLevel(); // Lấy api level của thiết bị android
    if (androidApiLevel >= 30) {
        // Nếu api level >= 30 thì phải được người dùng cấp một trong hai quyền ACCESS_COARSE_LOCATION hoặc ACCESS_FINE_LOCATION trước
        // rồi mới xing quyền ACCESS_BACKGROUND_LOCATION
        let result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        if (
            result['android.permission.ACCESS_FINE_LOCATION'] === 'granted' ||
            result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
        )
            return await alertRequestBackgroundLocationPermission(); // Nếu đã được cấp quyền truy cập GPS thì hiển thị alert cấp quyền truy cập GPS dưới nền
        else return false;
    } else {
        let requestBackground = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );

        return requestBackground === 'granted';
    }
};

const alertRequestBackgroundLocationPermission = () => {
    return new Promise<boolean>(resolve => {
        Alert.alert(
            'Truy cập GPS dưới nền',
            `Bạn cần cấp quyền truy cập GPS thành "luôn cho phép" để ứng dụng có thể thu thập vị trí của bạn ngay cả khi chạy nền.`,
            [
                {
                    text: 'Đồng ý',
                    onPress: async () => {
                        let checkBackground = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                        );
                        resolve(checkBackground === 'granted');
                    },
                },
                {
                    text: 'Huỷ',
                    style: 'cancel',
                    onPress: () => resolve(false),
                },
            ],
            {
                cancelable: false,
            },
        );
    });
};

const requestPermissionsAndroid = async () => {
    if (Platform.OS == 'android') {
        let perrmissionArray = [
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ];
        //ManhLD nếu Android 10 trở xuống thì xin luôn quyền ACCESS_BACKGROUND_LOCATION
        if (osVersion && Number(osVersion) <= 29) {
            perrmissionArray.push(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            );
            perrmissionArray.push(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            );
            perrmissionArray.push(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            perrmissionArray.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
        } else {
            perrmissionArray.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
            perrmissionArray.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO);
            perrmissionArray.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
        }

        PermissionsAndroid.requestMultiple(perrmissionArray).catch(err => {
            console.log(err);
        });
    } else {
        requestMultiple([
            PERMISSIONS.IOS.LOCATION_ALWAYS,
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.IOS.MICROPHONE,
        ]).then(result => { });
        async function requestUserPermission() { }
        requestUserPermission();
    }
};