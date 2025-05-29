import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import NativeGpsBackgroundService from './NativeGpsBackgroundService';

const eventEmitter = new NativeEventEmitter(NativeGpsBackgroundService);

class GpsBackgroundService {
  private static instance: GpsBackgroundService;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): GpsBackgroundService {
    if (!GpsBackgroundService.instance) {
      GpsBackgroundService.instance = new GpsBackgroundService();
    }
    return GpsBackgroundService.instance;
  }

  private setupEventListeners() {
    eventEmitter.addListener('onLocationUpdate', (location) => {
      this.notifyListeners('onLocationUpdate', location);
    });
  }

  public async startLocationUpdates(): Promise<void> {
    if (Platform.OS === 'android') {
      await NativeGpsBackgroundService.startLocationUpdates();
    }
  }

  public async stopLocationUpdates(): Promise<void> {
    if (Platform.OS === 'android') {
      await NativeGpsBackgroundService.stopLocationUpdates();
    }
  }

  public async isLocationUpdatesRunning(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return await NativeGpsBackgroundService.isLocationUpdatesRunning();
    }
    return false;
  }

  public async getLastLocation(): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null> {
    if (Platform.OS === 'android') {
      return await NativeGpsBackgroundService.getLastLocation();
    }
    return null;
  }

  public addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public removeListener(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export default GpsBackgroundService.getInstance();
