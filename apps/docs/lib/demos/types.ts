import type { Theme, ThemeName } from '@absolute-ui/tokens';
import type { ReactNode } from 'react';

export type DemoRenderArgs<V> = {
  values: V;
  theme: Theme;
  themeName: ThemeName;
};

export type DemoControlsArgs<V> = {
  values: V;
  setValue: <K extends keyof V>(key: K, next: V[K]) => void;
};

export type DemoConfig<V extends Record<string, unknown>> = {
  initialValues: V;
  /** Presets surfaced as quick-apply chips. */
  presets?: Array<{ label: string; values: Partial<V> }>;
  renderControls: (args: DemoControlsArgs<V>) => ReactNode;
  renderPreview: (args: DemoRenderArgs<V>) => ReactNode;
  generateCode: (args: DemoRenderArgs<V>) => string;
};

/** Bag of demos, keyed by primitive slug. */
// biome-ignore lint/suspicious/noExplicitAny: values shape differs per demo
export type DemoRegistry = Record<string, DemoConfig<any> | undefined>;
