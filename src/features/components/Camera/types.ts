import {Position} from 'react-native-image-marker';

export interface WatermarkStyle {
  color?: string;
  fontSize?: number;
  fontName?: string;
  bold?: boolean;
}

export interface CameraConfig {
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  enableHDR?: boolean;
  enableFlash?: boolean;
  enableFrontCamera?: boolean;
  photoQuality?: 'speed' | 'balanced' | 'quality';
  enableZoom?: boolean;
  videoBitRate?: 'low' | 'normal' | 'high';
  enableExposure?: boolean;
  enableUltraWide?: boolean;
  watermarkText?: string;
  watermarkPosition?: Position;
  watermarkStyle?: WatermarkStyle;
  multiple?: boolean;
  profileUser?: string | null;
  validateImage?: (image: ImageData) => boolean | Promise<boolean>;
  customControls?: {
    showZoomControl?: boolean;
    showFlashControl?: boolean;
    showHDRControl?: boolean;
    showExposureControl?: boolean;
    showCameraFlip?: boolean;
  };
  customStyles?: {
    container?: any;
    controls?: any;
    button?: any;
    watermark?: any;
  };
}

export interface ImageData {
  id: string;
  url: string;
  node: string;
}

export interface TakeAPhotoProps {
  isActive: boolean;
  onClose: () => void;
  config?: CameraConfig;
  onPhotoTaken?: (photo: ImageData) => void;
  onError?: (error: any) => void;
  onValidationError?: (error: string) => void;
}
