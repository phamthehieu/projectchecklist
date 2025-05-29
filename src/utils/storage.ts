import {MMKV} from 'react-native-mmkv';

export const appStorage = new MMKV({
  id: 'app-storage',
  encryptionKey: 'app-storage-key',
});
