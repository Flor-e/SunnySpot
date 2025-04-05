// utils/fontScaling.js
import { PixelRatio, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base width and height for scaling calculation (based on a standard device)
const baseWidth = 375; // iPhone X width
const baseHeight = 812; // iPhone X height

// Scales the size based on the screen dimensions
export const scale = (size) => {
  const widthRatio = width / baseWidth;
  return Math.round(size * widthRatio);
};

// Scales the size based on pixel density
export const normalize = (size) => {
  const scale = width / baseWidth;
  const newSize = size * scale;
  
  // Different scaling factor for different screen densities
  if (PixelRatio.get() < 2) {
    return Math.round(newSize) - 2;
  } else if (PixelRatio.get() >= 2 && PixelRatio.get() < 3) {
    return Math.round(newSize) - 1;
  } else {
    return Math.round(newSize);
  }
};

// Constants for consistent typography
export const FONT_SIZE = {
  EXTRA_SMALL: normalize(10),
  SMALL: normalize(12),
  MEDIUM: normalize(14),
  REGULAR: normalize(16),
  LARGE: normalize(18),
  EXTRA_LARGE: normalize(20),
  HEADER: normalize(25),
  TITLE: normalize(30),
  COUNT: normalize(50),
};

// Font family constants
export const FONT_FAMILY = {
  REGULAR: 'NunitoSans',
  BOLD: 'NunitoSansBold',
  EXTRA_BOLD: 'NunitoSansExtraBold',
  LIGHT: 'NunitoSansLight',
};

// Font weight constants (for cases where we can't use the family directly)
export const FONT_WEIGHT = {
  REGULAR: '400',
  MEDIUM: '500',
  SEMI_BOLD: '600',
  BOLD: '700',
  EXTRA_BOLD: '800',
};

// Line height scaling
export const LINE_HEIGHT = {
  SMALL: normalize(18),
  MEDIUM: normalize(24),
  LARGE: normalize(30),
};