import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  startLocationUpdates(): Promise<void>;
  stopLocationUpdates(): Promise<void>;
  isLocationUpdatesRunning(): Promise<boolean>;
  getLastLocation(): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('GpsBackgroundService');
