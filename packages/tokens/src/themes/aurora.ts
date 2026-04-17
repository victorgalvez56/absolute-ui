import { palette } from '../base/color.js';
import type { Theme } from '../theme.js';

export const aurora: Theme = {
  name: 'aurora',
  label: 'Aurora',
  dark: true,
  colors: {
    background: palette.neutral900,
    textPrimary: palette.neutral0,
    textSecondary: palette.neutral300,
    accent: palette.aurora400,
    onAccent: palette.neutral900,
    focusRing: palette.aurora200,
    divider: palette.neutral700,
    danger: palette.red200,
  },
  glass: {
    0: {
      tint: '#1E9B8222',
      blurRadius: 12,
      saturation: 1.1,
      borderColor: '#A6F0E044',
      borderWidth: 1,
      noiseOpacity: 0.04,
    },
    1: {
      tint: '#1E9B822E',
      blurRadius: 18,
      saturation: 1.15,
      borderColor: '#A6F0E055',
      borderWidth: 1,
      noiseOpacity: 0.05,
    },
    2: {
      tint: '#1E9B823A',
      blurRadius: 24,
      saturation: 1.2,
      borderColor: '#A6F0E066',
      borderWidth: 1,
      noiseOpacity: 0.06,
    },
    3: {
      tint: '#1E9B8245',
      blurRadius: 32,
      saturation: 1.25,
      borderColor: '#A6F0E077',
      borderWidth: 1,
      noiseOpacity: 0.07,
    },
  },
  motion: {
    surface: 'gentle',
    press: 'snappy',
    overlay: 'standard',
  },
};
