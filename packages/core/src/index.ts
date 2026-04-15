export const VERSION = '0.0.0';

export {
  AbsoluteUIContext,
  defaultContextValue,
  useAbsoluteUI,
} from './theme-context.js';
export type { AbsoluteUIContextValue } from './theme-context.js';

export {
  GlassSurface,
  buildGlassSurfaceStyle,
} from './components/GlassSurface/index.js';
export type { GlassSurfaceProps } from './components/GlassSurface/index.js';

export { GlassButton } from './components/GlassButton/index.js';
export type { GlassButtonProps } from './components/GlassButton/index.js';

export { GlassCard } from './components/GlassCard/index.js';
export type {
  GlassCardProps,
  GlassCardHeaderProps,
  GlassCardBodyProps,
  GlassCardFooterProps,
  GlassCardDividerProps,
} from './components/GlassCard/index.js';

export { GlassSheet } from './components/GlassSheet/index.js';
export type { GlassSheetProps } from './components/GlassSheet/index.js';

export { GlassNavBar } from './components/GlassNavBar/index.js';
export type { GlassNavBarProps } from './components/GlassNavBar/index.js';
