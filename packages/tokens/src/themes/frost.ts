import { palette } from '../base/color.js';
import type { Theme } from '../theme.js';

export const frost: Theme = {
  name: 'frost',
  label: 'Frost',
  dark: false,
  colors: {
    background: palette.neutral50,
    textPrimary: palette.neutral900,
    textSecondary: palette.neutral600,
    accent: palette.ice600,
    onAccent: palette.neutral0,
    focusRing: palette.ice400,
    divider: palette.neutral200,
  },
  glass: {
    0: {
      tint: '#FFFFFF55',
      blurRadius: 16,
      saturation: 1.05,
      borderColor: '#CDE9FF88',
      borderWidth: 1,
      noiseOpacity: 0.03,
    },
    1: {
      tint: '#FFFFFF66',
      blurRadius: 22,
      saturation: 1.1,
      borderColor: '#CDE9FF99',
      borderWidth: 1,
      noiseOpacity: 0.04,
    },
    2: {
      tint: '#FFFFFF77',
      blurRadius: 30,
      saturation: 1.15,
      borderColor: '#CDE9FFAA',
      borderWidth: 1,
      noiseOpacity: 0.05,
    },
    3: {
      tint: '#FFFFFF88',
      blurRadius: 38,
      saturation: 1.2,
      borderColor: '#CDE9FFBB',
      borderWidth: 1,
      noiseOpacity: 0.06,
    },
  },
  motion: {
    surface: 'gentle',
    press: 'standard',
    overlay: 'gentle',
  },
};
