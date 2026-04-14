import { palette } from '../base/color.js';
import type { Theme } from '../theme.js';

export const obsidian: Theme = {
  name: 'obsidian',
  label: 'Obsidian',
  dark: true,
  colors: {
    background: palette.neutral1000,
    textPrimary: palette.neutral0,
    textSecondary: palette.neutral300,
    accent: palette.magenta400,
    onAccent: palette.neutral0,
    focusRing: palette.indigo200,
    divider: palette.neutral800,
  },
  glass: {
    0: {
      tint: '#3A40C222',
      blurRadius: 14,
      saturation: 1.05,
      borderColor: '#C8CCFF33',
      borderWidth: 1,
      noiseOpacity: 0.05,
    },
    1: {
      tint: '#3A40C230',
      blurRadius: 20,
      saturation: 1.1,
      borderColor: '#C8CCFF44',
      borderWidth: 1,
      noiseOpacity: 0.06,
    },
    2: {
      tint: '#3A40C23C',
      blurRadius: 28,
      saturation: 1.15,
      borderColor: '#C8CCFF55',
      borderWidth: 1,
      noiseOpacity: 0.07,
    },
    3: {
      tint: '#3A40C248',
      blurRadius: 36,
      saturation: 1.2,
      borderColor: '#C8CCFF66',
      borderWidth: 1,
      noiseOpacity: 0.08,
    },
  },
  motion: {
    surface: 'standard',
    press: 'snappy',
    overlay: 'standard',
  },
};
