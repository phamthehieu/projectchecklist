import {Platform} from 'react-native';
import {
  PERMISSIONS,
  request,
  RESULTS,
  check,
  Permission,
} from 'react-native-permissions';

// Hàm xin quyền camera
export const requestCameraPermission = async (): Promise<boolean> => {
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  });

  if (!permission) return false;

  const result = await request(permission);
  return result === RESULTS.GRANTED;
};

// Hàm xin quyền thư viện ảnh
export const requestPhotoLibraryPermission = async (): Promise<boolean> => {
  try {
    const permissions = getPhotoLibraryPermissions();
    if (!permissions.length) return false;

    // Kiểm tra và yêu cầu từng quyền
    for (const permission of permissions) {
      const status = await check(permission);
      if (status === RESULTS.GRANTED) continue;

      const result = await request(permission);
      if (result !== RESULTS.GRANTED) return false;
    }

    return true;
  } catch (error) {
    console.error('Lỗi khi xin quyền thư viện ảnh:', error);
    return false;
  }
};

// Hàm lấy danh sách quyền cần thiết cho thư viện ảnh
const getPhotoLibraryPermissions = (): Permission[] => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      return [
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        PERMISSIONS.ANDROID.READ_MEDIA_VIDEO,
      ];
    }
    return [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];
  }

  if (Platform.OS === 'ios') {
    return [PERMISSIONS.IOS.PHOTO_LIBRARY];
  }

  return [];
};

// Hàm check trạng thái quyền (tùy chọn)
export const checkPermissionStatus = async (
  perm: Permission,
): Promise<string> => {
  const result = await check(perm);
  return result;
};
