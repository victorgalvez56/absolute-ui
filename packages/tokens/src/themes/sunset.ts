import { palette } from '../base/color.js';
import type { Theme } from '../theme.js';

export const sunset: Theme = {
  name: 'sunset',
  label: 'Sunset',
  dark: false,
  colors: {
    background: palette.amber200,
    textPrimary: palette.neutral900,
    textSecondary: palette.neutral700,
    accent: palette.coral600,
    onAccent: palette.neutral0,
    focusRing: palette.amber400,
    divider: palette.amber400,
  },
  glass: {
    0: {
      tint: '#FFB34733',
      blurRadius: 14,
      saturation: 1.15,
      borderColor: '#FFE2B3AA',
      borderWidth: 1,
      noiseOpacity: 0.05,
    },
    1: {
      tint: '#FFB34740',
      blurRadius: 20,
      saturation: 1.2,
      borderColor: '#FFE2B3BB',
      borderWidth: 1,
      noiseOpacity: 0.06,
    },
    2: {
      tint: '#FFB3474C',
      blurRadius: 28,
      saturation: 1.25,
      borderColor: '#FFE2B3CC',
      borderWidth: 1,
      noiseOpacity: 0.07,
    },
    3: {
      tint: '#FFB34758',
      blurRadius: 36,
      saturation: 1.3,
      borderColor: '#FFE2B3DD',
      borderWidth: 1,
      noiseOpacity: 0.08,
    },
  },
  motion: {
    surface: 'wobbly',
    press: 'snappy',
    overlay: 'standard',
  },
};
