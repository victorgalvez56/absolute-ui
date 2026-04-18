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
export type {
  GlassButtonProps,
  GlassButtonTextProps,
  GlassButtonIconProps,
  GlassButtonSpinnerProps,
  GlassButtonAction,
  GlassButtonVariant,
  GlassButtonSize,
} from './components/GlassButton/index.js';

export { Box, HStack, VStack } from './components/layout/index.js';
export type {
  BoxProps,
  HStackProps,
  VStackProps,
  BoxLayoutProps,
  SpacingValue,
} from './components/layout/index.js';

export { GlassCard } from './components/GlassCard/index.js';
export type {
  GlassCardProps,
  GlassCardHeaderProps,
  GlassCardBodyProps,
  GlassCardFooterProps,
  GlassCardDividerProps,
  GlassCardVariant,
  GlassCardAction,
  GlassCardSize,
} from './components/GlassCard/index.js';

export { GlassSheet } from './components/GlassSheet/index.js';
export type { GlassSheetProps } from './components/GlassSheet/index.js';

export { GlassNavBar } from './components/GlassNavBar/index.js';
export type { GlassNavBarProps } from './components/GlassNavBar/index.js';

export { GlassTabBar } from './components/GlassTabBar/index.js';
export type { GlassTabBarItem, GlassTabBarProps } from './components/GlassTabBar/index.js';

export { GlassModal } from './components/GlassModal/index.js';
export type { GlassModalProps } from './components/GlassModal/index.js';

export { GlassToast } from './components/GlassToast/index.js';
export type {
  GlassToastProps,
  ToastPosition,
  ToastVariant,
} from './components/GlassToast/index.js';

export { GlassInput } from './components/GlassInput/index.js';
export type { GlassInputProps, GlassInputSize } from './components/GlassInput/index.js';

export { GlassSwitch } from './components/GlassSwitch/index.js';
export type { GlassSwitchProps } from './components/GlassSwitch/index.js';

export { GlassSlider } from './components/GlassSlider/index.js';
export type { GlassSliderProps } from './components/GlassSlider/index.js';

export { GlassPicker } from './components/GlassPicker/index.js';
export type { GlassPickerItem, GlassPickerProps } from './components/GlassPicker/index.js';
