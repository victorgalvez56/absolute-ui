import type { SpringToken } from './base/motion.js';
import type { GlassRecipes } from './glass.js';

/**
 * Semantic color roles resolved by a theme. Components never reference
 * `palette` directly — they read from `theme.colors`, which lets a
 * personality remap the same role to a different primitive.
 */
export type ThemeColors = {
  /** Solid fallback background used when Reduced Transparency is on. */
  background: string;
  /** Text on top of a glass or solid surface (body copy). */
  textPrimary: string;
  /** Secondary / muted text. */
  textSecondary: string;
  /** Accent used for primary actions. */
  accent: string;
  /** Text color when painted on top of `accent`. */
  onAccent: string;
  /** Focus ring color for keyboard / switch control. */
  focusRing: string;
  /** Divider / hairline color. */
  divider: string;
};

/**
 * Motion personality — each theme picks a spring identity so Aurora
 * feels different from Obsidian even when animating the same property.
 */
export type ThemeMotion = {
  surface: SpringToken;
  press: SpringToken;
  overlay: SpringToken;
};

export type ThemeName = 'aurora' | 'obsidian' | 'frost' | 'sunset';

export type Theme = {
  name: ThemeName;
  /** Display name for docs and theme switchers. */
  label: string;
  /** True if the theme is intended for dark ambient conditions. */
  dark: boolean;
  colors: ThemeColors;
  glass: GlassRecipes;
  motion: ThemeMotion;
};
