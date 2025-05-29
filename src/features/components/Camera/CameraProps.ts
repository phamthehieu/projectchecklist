import {ModalProps} from 'react-native';
import {Position} from 'react-native-image-marker';

export interface ImageProps {
  id: string;
  url: string;
  node: string;
}

export interface VideoProps {
  id: string;
  url: string;
  node: string;
}

export interface CameraConfig {
  enableZoom?: boolean;
  enableFlash?: boolean;
  enableHDR?: boolean;
  enableExposure?: boolean;
  enableUltraWide?: boolean;
  enableFrontCamera?: boolean;
  maxZoom?: number;
  minZoom?: number;
  defaultZoom?: number;
  watermarkText?: string;
  watermarkPosition?: Position;
  watermarkStyle?: {
    color?: string;
    fontSize?: number;
    fontName?: string;
    bold?: boolean;
  };
  photoQuality?: 'speed' | 'balanced' | 'quality';
  videoBitRate?: 'low' | 'normal' | 'high';
}

export interface Props extends Partial<ModalProps> {
  isActive: boolean;
  onClose: () => void;
  kinhdo?: number;
  vido?: number;
  vitri?: string;
  multiple?: boolean;
  profileUser?: any;
  config?: CameraConfig;
  onPhotoTaken?: (photo: ImageProps) => void;
  onError?: (error: any) => void;
}
