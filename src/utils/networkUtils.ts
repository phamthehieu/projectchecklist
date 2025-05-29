import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

export const checkNetworkConnection = async (): Promise<{
  isConnected: boolean;
  type: string;
  isInternetReachable: boolean | null;
}> => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected ?? false,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
    };
  } catch (error) {
    console.error('Lỗi khi kiểm tra kết nối mạng:', error);
    return {
      isConnected: false,
      type: 'unknown',
      isInternetReachable: false,
    };
  }
};

// Hàm lắng nghe sự thay đổi trạng thái mạng
export const subscribeToNetworkChanges = (
  callback: (state: {
    isConnected: boolean;
    type: string;
    isInternetReachable: boolean | null;
  }) => void,
) => {
  return NetInfo.addEventListener((state: NetInfoState) => {
    callback({
      isConnected: state.isConnected ?? false,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
    });
  });
};
