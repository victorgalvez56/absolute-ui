'use client';

import { type Theme, type ThemeName, radius, spacing, spring, themes } from '@absolute-ui/tokens';
import { useMemo, useState } from 'react';

const THEME_ORDER: ThemeName[] = ['aurora', 'obsidian', 'frost', 'sunset'];

const PERSONALITY_BLURB: Record<ThemeName, string> = {
  aurora: 'Nocturnal greens, gentle motion. The default dark personality.',
  obsidian: 'Deep indigo with a magenta accent. High-contrast, snappy press.',
  frost: 'Cold light, crystalline edges. Calm motion for everyday surfaces.',
  sunset: 'Warm amber wash with coral accent. Wobbly motion, playful feel.',
};

function toThemeVars(theme: Theme): Record<string, string> {
  // Override the resolved --color-* variables directly. Tailwind v4's @theme
  // block emits `:root { --color-*: var(--aui-*); }`, which computes to a
  // literal color at :root — descendants inherit the concrete value and
  // overriding --aui-* alone has no effect. Setting --color-* here is what
  // actually re-paints the whole subtree.
  return {
    '--aui-background': theme.colors.background,
    '--aui-surface': theme.colors.background,
    '--aui-text-primary': theme.colors.textPrimary,
    '--aui-text-secondary': theme.colors.textSecondary,
    '--aui-accent': theme.colors.accent,
    '--aui-on-accent': theme.colors.onAccent,
    '--aui-focus-ring': theme.colors.focusRing,
    '--aui-divider': theme.colors.divider,
    '--aui-danger': theme.colors.danger,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.background,
    '--color-text-primary': theme.colors.textPrimary,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-accent': theme.colors.accent,
    '--color-on-accent': theme.colors.onAccent,
    '--color-focus-ring': theme.colors.focusRing,
    '--color-divider': theme.colors.divider,
    '--color-danger': theme.colors.danger,
  };
}

function serializeTheme(theme: Theme): string {
  const c = theme.colors;
  const m = theme.motion;
  const glassLines = ([0, 1, 2, 3] as const)
    .map((elev) => {
      const r = theme.glass[elev];
      return `    ${elev}: {
      tint: '${r.tint}',
      blurRadius: ${r.blurRadius},
      saturation: ${r.saturation},
      borderColor: '${r.borderColor}',
      borderWidth: ${r.borderWidth},
      noiseOpacity: ${r.noiseOpacity},
    },`;
    })
    .join('\n');

  return `import type { Theme } from '@absolute-ui/tokens';

export const ${theme.name}: Theme = {
  name: '${theme.name}',
  label: '${theme.label}',
  dark: ${theme.dark},
  colors: {
    background: '${c.background}',
    textPrimary: '${c.textPrimary}',
    textSecondary: '${c.textSecondary}',
    accent: '${c.accent}',
    onAccent: '${c.onAccent}',
    focusRing: '${c.focusRing}',
    divider: '${c.divider}',
    danger: '${c.danger}',
  },
  glass: {
${glassLines}
  },
  motion: {
    surface: '${m.surface}',
    press: '${m.press}',
    overlay: '${m.overlay}',
  },
};
`;
}

function PersonalityCard({
  theme,
  active,
  onSelect,
}: {
  theme: Theme;
  active: boolean;
  onSelect: (name: ThemeName) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Select ${theme.label} personality`}
      onClick={() => onSelect(theme.name)}
      className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        borderColor: active ? theme.colors.accent : theme.colors.divider,
        borderWidth: active ? 2 : 1,
        boxShadow: active ? `0 0 0 4px ${theme.colors.focusRing}33` : 'none',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        style={{
          backgroundImage: `radial-gradient(400px at 20% 15%, ${theme.colors.accent}55 0%, transparent 55%), radial-gradient(380px at 85% 85%, ${theme.colors.focusRing}44 0%, transparent 60%)`,
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">{theme.label}</span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
          style={{
            backgroundColor: `${theme.colors.textPrimary}1A`,
            color: theme.colors.textSecondary,
          }}
        >
          {theme.dark ? 'Dark' : 'Light'}
        </span>
      </div>
      <div className="flex gap-1.5">
        <span
          className="h-6 w-6 rounded-md border border-white/20"
          style={{ backgroundColor: theme.colors.accent }}
        />
        <span
          className="h-6 w-6 rounded-md border border-white/20"
          style={{ backgroundColor: theme.colors.focusRing }}
        />
        <span
          className="h-6 w-6 rounded-md border border-white/20"
          style={{ backgroundColor: theme.colors.textPrimary }}
        />
        <span
          className="h-6 w-6 rounded-md border border-white/20"
          style={{ backgroundColor: theme.colors.divider }}
        />
      </div>
      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
        {PERSONALITY_BLURB[theme.name]}
      </p>
    </button>
  );
}

/**
 * A visual mock that demonstrates the selected theme applied to a
 * small "app shell" — nav, hero, card, buttons, input, list. Every
 * surface uses the theme's semantic colors and a real CSS glass
 * recipe so swapping personality produces a believable before/after.
 */
function AppPreview({ theme }: { theme: Theme }) {
  const g2 = theme.glass[2];
  const g1 = theme.glass[1];
  const springCfg = spring[theme.motion.press];
  const pressMs = Math.round(Math.sqrt(springCfg.mass / springCfg.stiffness) * 1000);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border shadow-2xl"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        borderColor: theme.colors.divider,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(1000px at 15% 10%, ${theme.colors.accent}44 0%, transparent 55%), radial-gradient(900px at 90% 90%, ${theme.colors.focusRing}33 0%, transparent 60%)`,
        }}
      />
      <div className="relative p-6 sm:p-10">
        <div
          className="flex items-center justify-between rounded-full px-4 py-2"
          style={{
            backgroundColor: `${theme.colors.textPrimary}10`,
            backdropFilter: `blur(${g1.blurRadius}px) saturate(${g1.saturation})`,
            WebkitBackdropFilter: `blur(${g1.blurRadius}px) saturate(${g1.saturation})`,
            border: `${g1.borderWidth}px solid ${g1.borderColor}`,
          }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span
              aria-hidden
              className="inline-block h-5 w-5 rounded-md"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.focusRing})`,
              }}
            />
            Absolute
          </div>
          <div
            className="flex items-center gap-4 text-xs"
            style={{ color: theme.colors.textSecondary }}
          >
            <span>Home</span>
            <span>Library</span>
            <span>Settings</span>
          </div>
        </div>

        <div className="mt-8">
          <p
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: theme.colors.textSecondary }}
          >
            {theme.label} · {theme.dark ? 'Dark' : 'Light'}
          </p>
          <h3 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Liquid glass, this personality.
          </h3>
          <p className="mt-3 max-w-md text-sm" style={{ color: theme.colors.textSecondary }}>
            Every surface below is painted with <code className="font-mono">{theme.name}</code>{' '}
            tokens — same primitives, different soul.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <PressButton
              label="Primary action"
              backgroundColor={theme.colors.accent}
              color={theme.colors.onAccent}
              pressMs={pressMs}
            />
            <PressButton
              label="Secondary"
              backgroundColor="transparent"
              color={theme.colors.textPrimary}
              pressMs={pressMs}
              borderColor={theme.colors.divider}
            />
          </div>
        </div>

        <div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
          style={{ color: theme.colors.textPrimary }}
        >
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: g2.tint,
              backdropFilter: `blur(${g2.blurRadius}px) saturate(${g2.saturation})`,
              WebkitBackdropFilter: `blur(${g2.blurRadius}px) saturate(${g2.saturation})`,
              border: `${g2.borderWidth}px solid ${g2.borderColor}`,
            }}
          >
            <div
              className="text-xs uppercase tracking-widest"
              style={{ color: theme.colors.textSecondary }}
            >
              Glass · elevation 2
            </div>
            <div className="mt-2 text-lg font-semibold">This is a card.</div>
            <p className="mt-1 text-sm" style={{ color: theme.colors.textSecondary }}>
              Blur {g2.blurRadius}px · saturate {g2.saturation} · noise {g2.noiseOpacity}.
            </p>
            <div
              className="mt-4 flex h-11 items-center rounded-full px-4 text-sm"
              style={{
                backgroundColor: `${theme.colors.textPrimary}0F`,
                border: `1px solid ${theme.colors.divider}`,
                color: theme.colors.textSecondary,
              }}
            >
              Search library…
            </div>
          </div>

          <div
            className="flex flex-col rounded-2xl"
            style={{
              backgroundColor: `${theme.colors.textPrimary}0A`,
              border: `1px solid ${theme.colors.divider}`,
            }}
          >
            <ListRow
              title="Performance budget"
              meta="P50 · 58fps"
              dividerColor={theme.colors.divider}
              textSecondary={theme.colors.textSecondary}
              badgeColor={theme.colors.accent}
            />
            <ListRow
              title="APCA contrast"
              meta="|Lc| 82"
              dividerColor={theme.colors.divider}
              textSecondary={theme.colors.textSecondary}
              badgeColor={theme.colors.focusRing}
            />
            <ListRow
              title="Hit target floor"
              meta="44pt"
              dividerColor={theme.colors.divider}
              textSecondary={theme.colors.textSecondary}
              badgeColor={theme.colors.accent}
              last
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ListRow({
  title,
  meta,
  dividerColor,
  textSecondary,
  badgeColor,
  last,
}: {
  title: string;
  meta: string;
  dividerColor: string;
  textSecondary: string;
  badgeColor: string;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ borderBottom: last ? undefined : `1px solid ${dividerColor}` }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: badgeColor }}
        />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <span className="font-mono text-xs" style={{ color: textSecondary }}>
        {meta}
      </span>
    </div>
  );
}

function PressButton({
  label,
  backgroundColor,
  color,
  pressMs,
  borderColor,
}: {
  label: string;
  backgroundColor: string;
  color: string;
  pressMs: number;
  borderColor?: string;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold"
      style={{
        backgroundColor,
        color,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
        transform: pressed ? 'scale(0.96)' : 'scale(1)',
        transition: `transform ${pressMs}ms cubic-bezier(0.2,0,0,1)`,
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      {label}
    </button>
  );
}

function ColorSwatch({
  role,
  value,
  textOn,
}: {
  role: string;
  value: string;
  textOn: string;
}) {
  return (
    <div
      className="flex flex-col justify-between rounded-xl p-3"
      style={{ backgroundColor: value, color: textOn, minHeight: 88 }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider">{role}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}

function pickContrastText(bg: string, theme: Theme): string {
  // Compare luminance roughly by the first two hex digits of each channel.
  const hex = bg.replace('#', '');
  if (hex.length < 6) return theme.colors.textPrimary;
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#000000' : '#FFFFFF';
}

function GlassTile({ theme, elevation }: { theme: Theme; elevation: 0 | 1 | 2 | 3 }) {
  const r = theme.glass[elevation];
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        backgroundImage: `radial-gradient(350px at 20% 20%, ${theme.colors.accent}66 0%, transparent 60%), radial-gradient(320px at 80% 80%, ${theme.colors.focusRing}55 0%, transparent 60%)`,
        backgroundColor: theme.colors.background,
        minHeight: 220,
      }}
    >
      <div
        className="absolute inset-4 flex flex-col justify-between rounded-xl p-4"
        style={{
          backgroundColor: r.tint,
          backdropFilter: `blur(${r.blurRadius}px) saturate(${r.saturation})`,
          WebkitBackdropFilter: `blur(${r.blurRadius}px) saturate(${r.saturation})`,
          border: `${r.borderWidth}px solid ${r.borderColor}`,
          color: theme.colors.textPrimary,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest">
            Elevation {elevation}
          </span>
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[10px]"
            style={{
              backgroundColor: `${theme.colors.textPrimary}1A`,
              color: theme.colors.textSecondary,
            }}
          >
            blur {r.blurRadius}
          </span>
        </div>
        <dl
          className="grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[11px]"
          style={{ color: theme.colors.textSecondary }}
        >
          <div>tint</div>
          <div className="text-right">{r.tint}</div>
          <div>sat</div>
          <div className="text-right">{r.saturation}</div>
          <div>border</div>
          <div className="text-right">{r.borderColor}</div>
          <div>noise</div>
          <div className="text-right">{r.noiseOpacity}</div>
        </dl>
      </div>
    </div>
  );
}

function MotionCard({
  label,
  token,
  accent,
  textSecondary,
  divider,
}: {
  label: string;
  token: keyof typeof spring;
  accent: string;
  textSecondary: string;
  divider: string;
}) {
  const cfg = spring[token];
  return (
    <div className="rounded-2xl p-4" style={{ border: `1px solid ${divider}` }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          {token}
        </span>
      </div>
      <dl
        className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px]"
        style={{ color: textSecondary }}
      >
        <div>
          <div className="opacity-70">stiff</div>
          <div>{cfg.stiffness}</div>
        </div>
        <div>
          <div className="opacity-70">damp</div>
          <div>{cfg.damping}</div>
        </div>
        <div>
          <div className="opacity-70">mass</div>
          <div>{cfg.mass}</div>
        </div>
      </dl>
    </div>
  );
}

export function ThemeLab() {
  const [activeName, setActiveName] = useState<ThemeName>('aurora');
  const [copied, setCopied] = useState(false);
  const active = themes[activeName];

  const previewStyle = useMemo(
    () =>
      ({
        ...toThemeVars(active),
        color: 'var(--color-text-primary)',
        backgroundColor: 'var(--color-background)',
        backgroundImage:
          'radial-gradient(1200px at 15% 10%, color-mix(in oklab, var(--color-accent) 30%, transparent) 0%, transparent 60%), radial-gradient(900px at 85% 80%, color-mix(in oklab, var(--color-focus-ring) 22%, transparent) 0%, transparent 65%)',
        transition: 'background-color 240ms ease, color 240ms ease',
      }) as React.CSSProperties,
    [active],
  );

  const colorEntries = Object.entries(active.colors) as Array<[string, string]>;

  async function copyTokens() {
    try {
      await navigator.clipboard.writeText(serializeTheme(active));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      style={previewStyle}
      className="mt-6 overflow-hidden rounded-[28px] border border-[color:var(--color-divider)] px-6 pb-10 shadow-2xl sm:px-10"
    >
      <section className="pt-14 pb-8">
        <p className="text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)]">
          Theme Lab · live preview
        </p>
        <h1 className="mt-3 text-5xl font-semibold leading-tight sm:text-6xl">
          Four personalities,
          <br />
          one design system.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-[color:var(--color-text-secondary)]">
          Pick a personality. Every surface on this page — buttons, cards, glass, motion — re-paints
          against the selected tokens in real time. Copy the config when you find the one your app
          wants to be.
        </p>
      </section>

      <section aria-labelledby="switcher-heading" className="pb-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="switcher-heading" className="text-xl font-semibold">
              Pick a personality
            </h2>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Currently active: <strong>{active.label}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={copyTokens}
            className="inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              borderColor: 'transparent',
            }}
            aria-live="polite"
          >
            {copied ? 'Copied!' : `Copy ${active.label} theme tokens`}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {THEME_ORDER.map((name) => (
            <PersonalityCard
              key={name}
              theme={themes[name]}
              active={activeName === name}
              onSelect={setActiveName}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="preview-heading" className="py-8">
        <h2 id="preview-heading" className="sr-only">
          Live preview
        </h2>
        <AppPreview theme={active} />
      </section>

      <section aria-labelledby="colors-heading" className="py-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 id="colors-heading" className="text-2xl font-semibold">
              Color roles
            </h2>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Nine semantic slots. APCA-verified at every elevation.
            </p>
          </div>
          <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
            theme.colors
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {colorEntries.map(([role, value]) => (
            <ColorSwatch
              key={role}
              role={role}
              value={value}
              textOn={pickContrastText(value, active)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="glass-heading" className="py-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 id="glass-heading" className="text-2xl font-semibold">
              Glass recipes
            </h2>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Four elevations, composed of tint · blur · saturation · border · noise.
            </p>
          </div>
          <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
            theme.glass
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {([0, 1, 2, 3] as const).map((elev) => (
            <GlassTile key={elev} theme={active} elevation={elev} />
          ))}
        </div>
      </section>

      <section aria-labelledby="motion-heading" className="py-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 id="motion-heading" className="text-2xl font-semibold">
              Motion identity
            </h2>
            <p className="text-sm text-[color:var(--color-text-secondary)]">
              Each personality picks its own spring for surfaces, press, and overlays.
            </p>
          </div>
          <span className="font-mono text-xs text-[color:var(--color-text-secondary)]">
            theme.motion
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MotionCard
            label="Surface"
            token={active.motion.surface}
            accent={active.colors.accent}
            textSecondary={active.colors.textSecondary}
            divider={active.colors.divider}
          />
          <MotionCard
            label="Press"
            token={active.motion.press}
            accent={active.colors.accent}
            textSecondary={active.colors.textSecondary}
            divider={active.colors.divider}
          />
          <MotionCard
            label="Overlay"
            token={active.motion.overlay}
            accent={active.colors.accent}
            textSecondary={active.colors.textSecondary}
            divider={active.colors.divider}
          />
        </div>
      </section>

      <section aria-labelledby="scale-heading" className="py-10">
        <div className="mb-4">
          <h2 id="scale-heading" className="text-2xl font-semibold">
            Scales
          </h2>
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            Shared across all personalities — spacing and radius are base tokens.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl p-4" style={{ border: `1px solid ${active.colors.divider}` }}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Spacing</span>
              <span
                className="font-mono text-[11px]"
                style={{ color: active.colors.textSecondary }}
              >
                spacing
              </span>
            </div>
            <ul className="flex flex-col gap-1">
              {Object.entries(spacing).map(([name, px]) => (
                <li key={name} className="flex items-center gap-3">
                  <span
                    className="w-16 font-mono text-[11px]"
                    style={{ color: active.colors.textSecondary }}
                  >
                    {name}
                  </span>
                  <span
                    className="h-2 rounded-full"
                    style={{
                      width: Math.max(px, 1),
                      backgroundColor: active.colors.accent,
                    }}
                  />
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: active.colors.textSecondary }}
                  >
                    {px}px
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-4" style={{ border: `1px solid ${active.colors.divider}` }}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Radius</span>
              <span
                className="font-mono text-[11px]"
                style={{ color: active.colors.textSecondary }}
              >
                radius
              </span>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              {Object.entries(radius).map(([name, px]) => (
                <div key={name} className="flex flex-col items-center gap-1">
                  <span
                    className="h-14 w-14"
                    style={{
                      borderRadius: Math.min(px, 28),
                      backgroundColor: `${active.colors.accent}55`,
                      border: `1px solid ${active.colors.accent}`,
                    }}
                  />
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: active.colors.textSecondary }}
                  >
                    {name} · {px}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
