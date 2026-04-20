import { glassButtonDemo } from './glass-button';
import { glassCardDemo } from './glass-card';
import { glassInputDemo } from './glass-input';
import { glassModalDemo } from './glass-modal';
import { glassNavBarDemo } from './glass-nav-bar';
import { glassPickerDemo } from './glass-picker';
import { glassSheetDemo } from './glass-sheet';
import { glassSliderDemo } from './glass-slider';
import { glassSurfaceDemo } from './glass-surface';
import { glassSwitchDemo } from './glass-switch';
import { glassTabBarDemo } from './glass-tab-bar';
import { glassToastDemo } from './glass-toast';
import type { DemoRegistry } from './types';

/**
 * Registry of interactive demos keyed by primitive slug. A slug without
 * an entry renders the Ladle iframe fallback on its page.
 */
export const demos: DemoRegistry = {
  'glass-surface': glassSurfaceDemo,
  'glass-button': glassButtonDemo,
  'glass-card': glassCardDemo,
  'glass-sheet': glassSheetDemo,
  'glass-nav-bar': glassNavBarDemo,
  'glass-tab-bar': glassTabBarDemo,
  'glass-modal': glassModalDemo,
  'glass-toast': glassToastDemo,
  'glass-input': glassInputDemo,
  'glass-switch': glassSwitchDemo,
  'glass-slider': glassSliderDemo,
  'glass-picker': glassPickerDemo,
};

export function getDemo(slug: string) {
  return demos[slug];
}

export function hasDemo(slug: string): boolean {
  return demos[slug] !== undefined;
}
