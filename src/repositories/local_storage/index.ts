import {MMKV} from 'react-native-mmkv';
class Storage extends MMKV {
  setObject(key: string, value: any) {
    let json: string = JSON.stringify(value);
    this.set(key, json);
  }

  getObject<T = any>(key: string): T {
    let value: T;
    let json = this.getString(key);
    value = json ? JSON.parse(json) : undefined;
    return value;
  }

  getBool(key: string, defaultValue: boolean = true): boolean {
    const value = this.getBoolean(key);
    return value !== undefined ? value : defaultValue;
  }

  setBool(key: string, value: boolean) {
    this.set(key, value);
  }

  getString(key: string, defaultValue: string = ''): string {
    const value = this.getString(key);
    return value !== undefined ? value : defaultValue;
  }

  setString(key: string, value: string) {
    this.set(key, value);
  }
}
const appStorage = new Storage();
export default appStorage;
