import type { Theme, ThemeName } from '../theme.js';
import { aurora } from './aurora.js';
import { frost } from './frost.js';
import { obsidian } from './obsidian.js';
import { sunset } from './sunset.js';

export { aurora, obsidian, frost, sunset };

export const themes: Record<ThemeName, Theme> = {
  aurora,
  obsidian,
  frost,
  sunset,
};

export const defaultTheme: Theme = aurora;
