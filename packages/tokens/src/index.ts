export { palette } from './base/color.js';
export type { PaletteToken } from './base/color.js';

export { spacing } from './base/spacing.js';
export type { SpacingToken } from './base/spacing.js';

export { radius } from './base/radius.js';
export type { RadiusToken } from './base/radius.js';

export { duration, easing, spring } from './base/motion.js';
export type {
  DurationToken,
  EasingToken,
  SpringConfig,
  SpringToken,
} from './base/motion.js';

export {
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} from './base/typography.js';
export type {
  FontSizeToken,
  FontWeightToken,
  LineHeightToken,
  LetterSpacingToken,
} from './base/typography.js';

export type { GlassRecipe, GlassRecipes, GlassElevation } from './glass.js';
export type { Theme, ThemeColors, ThemeMotion, ThemeName } from './theme.js';

export {
  aurora,
  obsidian,
  frost,
  sunset,
  themes,
  defaultTheme,
} from './themes/index.js';
