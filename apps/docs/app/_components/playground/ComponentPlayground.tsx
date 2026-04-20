'use client';

/**
 * Interactive component demo — the same concept as gluestack-ui's
 * component playground, reworked to sit inside the Absolute UI visual
 * system. The preview canvas uses the real theme tokens (glass
 * recipes, accent, focus ring) so changing the personality swaps the
 * refraction instead of just recoloring an illustration.
 *
 * Orchestration only: the preview and code generator come from a
 * per-primitive demo config so each slug can contribute its own
 * controls, render, and snippet without branching logic here.
 */

import { aurora, frost, obsidian, sunset, type Theme, type ThemeName } from '@absolute-ui/tokens';
import { type ReactNode, useMemo, useState } from 'react';
import { SegmentedControl } from './controls';

const THEMES: Record<ThemeName, Theme> = { aurora, obsidian, frost, sunset };
const THEME_ORDER: ReadonlyArray<ThemeName> = ['aurora', 'obsidian', 'frost', 'sunset'];

export type PlaygroundRender<V> = (args: {
  values: V;
  theme: Theme;
  themeName: ThemeName;
}) => ReactNode;

export type PlaygroundCodeGen<V> = (args: {
  values: V;
  theme: Theme;
  themeName: ThemeName;
}) => string;

export type ComponentPlaygroundProps<V extends Record<string, unknown>> = {
  initialValues: V;
  /** Top-row controls — rendered on the right side of the canvas. */
  renderControls: (args: {
    values: V;
    setValue: <K extends keyof V>(key: K, next: V[K]) => void;
  }) => ReactNode;
  /** The live preview. Must paint on a dark / transparent backdrop. */
  renderPreview: PlaygroundRender<V>;
  /** Code snippet that mirrors the current control state. */
  generateCode: PlaygroundCodeGen<V>;
  /** Preset values surfaced as quick chips above the preview. */
  presets?: Array<{ label: string; values: Partial<V> }>;
  /** Languages to label on the code block. Defaults to `tsx`. */
  codeLanguage?: string;
};

export function ComponentPlayground<V extends Record<string, unknown>>({
  initialValues,
  renderControls,
  renderPreview,
  generateCode,
  presets,
  codeLanguage = 'tsx',
}: ComponentPlaygroundProps<V>) {
  const [values, setValues] = useState<V>(initialValues);
  const [themeName, setThemeName] = useState<ThemeName>('aurora');
  const [copied, setCopied] = useState(false);

  const theme = THEMES[themeName];

  const setValue = <K extends keyof V>(key: K, next: V[K]) => {
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const code = useMemo(
    () => generateCode({ values, theme, themeName }),
    [values, theme, themeName, generateCode],
  );

  const onCopy = () => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {
        /* clipboard unavailable — no-op */
      },
    );
  };

  const applyPreset = (partial: Partial<V>) => {
    setValues((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[color:var(--color-divider)] bg-[color-mix(in_oklab,var(--color-background)_40%,black_60%)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-divider)] px-4 py-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: theme.colors.accent }}
          />
          <span>Interactive demo · {theme.label}</span>
        </div>
        <SegmentedControl
          label=""
          value={themeName}
          onChange={setThemeName}
          options={THEME_ORDER.map((n) => ({ label: THEMES[n].label, value: n }))}
        />
      </div>

      {presets && presets.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--color-divider)] px-4 py-3">
          <span className="text-[11px] uppercase tracking-widest text-[color:var(--color-text-secondary)]">
            Presets
          </span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.values)}
              className="rounded-full border border-[color:var(--color-divider)] px-3 py-1 text-xs transition-colors hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]">
        <PreviewCanvas theme={theme}>{renderPreview({ values, theme, themeName })}</PreviewCanvas>
        <div className="border-t border-[color:var(--color-divider)] p-5 lg:border-l lg:border-t-0">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-secondary)]">
            Props
          </div>
          <div className="flex flex-col gap-5">{renderControls({ values, setValue })}</div>
        </div>
      </div>

      <div className="border-t border-[color:var(--color-divider)]">
        <div className="flex items-center justify-between border-b border-[color:var(--color-divider)] px-4 py-2 text-xs uppercase tracking-wider text-[color:var(--color-text-secondary)]">
          <span>{codeLanguage}</span>
          <button
            type="button"
            onClick={onCopy}
            className="rounded-md border border-[color:var(--color-divider)] px-2 py-0.5 text-[11px] normal-case tracking-normal transition-colors hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-4 text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Photographic backdrop used behind every preview. The gradient is
 * driven off the theme accent + focus ring so each personality looks
 * like itself, and a subtle grid + grain keep the glass from looking
 * rendered against flat color.
 */
function PreviewCanvas({ theme, children }: { theme: Theme; children: ReactNode }) {
  const accent = theme.colors.accent;
  const focus = theme.colors.focusRing;
  const bg = theme.dark ? '#05080B' : '#E8EEF4';
  return (
    <div
      className="relative flex min-h-[320px] items-center justify-center overflow-hidden p-8 sm:min-h-[380px] sm:p-12"
      style={{
        backgroundColor: bg,
        backgroundImage: [
          `radial-gradient(1200px at 15% 10%, ${accent}55 0%, transparent 55%)`,
          `radial-gradient(900px at 85% 80%, ${focus}44 0%, transparent 60%)`,
          `radial-gradient(600px at 50% 50%, ${accent}22 0%, transparent 70%)`,
        ].join(','),
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 75%)',
        }}
      />
      <div className="relative z-10 flex w-full max-w-3xl items-center justify-center">
        {children}
      </div>
    </div>
  );
}
