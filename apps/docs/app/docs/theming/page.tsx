import { CodeBlock, InlineCode } from '@/app/_components/code-block';
import { DocsSidebar } from '@/app/_components/docs-sidebar';
import { Footer } from '@/app/_components/footer';
import { Nav } from '@/app/_components/nav';
import { ThemeSwatch } from '@/app/_components/theme-swatch';
import {
  aurora,
  frost,
  obsidian,
  radius,
  spacing,
  spring,
  sunset,
  type Theme,
} from '@absolute-ui/tokens';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Theming & tokens',
  description:
    'The four Absolute UI personalities — Aurora, Obsidian, Frost, Sunset — plus the palette, spacing, radius, typography, and motion scales every primitive consumes.',
};

const themeCards: Array<{
  theme: Theme;
  tagline: string;
  story: string;
}> = [
  {
    theme: aurora,
    tagline: 'Green-black-teal · dark personality · the default identity.',
    story:
      'Aurora is the flagship. A deep neutral background lets a teal tint sit at the heart of every elevation, and the focus ring is a pale aurora so keyboard traversal is unmistakable on any surface.',
  },
  {
    theme: obsidian,
    tagline: 'Indigo-magenta · dark personality · the moodier sibling.',
    story:
      'Obsidian pushes the background deeper and swaps the tint for a violet-indigo recipe. A magenta accent and an indigo focus ring keep action affordance and traversal signals distinct.',
  },
  {
    theme: frost,
    tagline: 'Ice-neutral · light personality · calm professional surfaces.',
    story:
      'Frost is the default light personality. A pale neutral background refracts an ice-blue tint so the glass keeps depth, and the gentle motion pairing makes surface transitions feel exhaled rather than snapped.',
  },
  {
    theme: sunset,
    tagline: 'Amber-coral · light personality · warm, editorial, confident.',
    story:
      'Sunset turns up the saturation. The amber background and coral accent give the surface a cinematic warmth, and a wobbly surface spring means the personality literally moves differently from Frost.',
  },
];

const spacingEntries: Array<[string, number]> = Object.entries(spacing).map(([k, v]) => [
  k,
  v as number,
]);
const radiusEntries: Array<[string, number]> = Object.entries(radius).map(([k, v]) => [
  k,
  v as number,
]);
const springEntries: Array<[string, (typeof spring)[keyof typeof spring]]> = Object.entries(
  spring,
).map(([k, v]) => [k, v as (typeof spring)[keyof typeof spring]]);

export default function ThemingPage() {
  return (
    <>
      <Nav />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:flex-row lg:gap-10">
        <DocsSidebar />
        <main className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="pt-8 text-sm">
            <Link
              href="/docs"
              className="text-[color:var(--color-text-secondary)] no-underline hover:underline"
            >
              ← All docs
            </Link>
          </nav>
          <header className="py-6">
            <p className="text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)]">
              Guide
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Theming &amp; tokens</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--color-text-secondary)]">
              A personality is a bundle of semantic colors, glass recipes, and motion identity.
              Primitives never import palette values directly — they read from{' '}
              <InlineCode>theme.colors</InlineCode>, <InlineCode>theme.glass</InlineCode>, and{' '}
              <InlineCode>theme.motion</InlineCode>, so swapping personalities never requires
              touching a component.
            </p>
          </header>

          <section aria-labelledby="personalities-heading" className="py-4">
            <h2 id="personalities-heading" className="text-2xl font-semibold">
              The four personalities
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              Two dark, two light. Every one ships with its own accent, focus ring, divider,
              danger color, four-elevation glass recipe, and motion personality.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {themeCards.map(({ theme }) => (
                <ThemeSwatch key={theme.name} theme={theme} />
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {themeCards.map(({ theme, tagline, story }) => (
                <article
                  key={theme.name}
                  className="rounded-2xl border border-[color:var(--color-divider)] p-5"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-lg font-semibold">{theme.label}</h3>
                    <span className="text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
                      {theme.dark ? 'Dark' : 'Light'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                    {tagline}
                  </p>
                  <p className="mt-3 text-sm">{story}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-[color:var(--color-text-secondary)]">
                    <div>
                      <dt className="uppercase tracking-widest">Accent</dt>
                      <dd className="mt-1 font-mono">{theme.colors.accent}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-widest">Focus ring</dt>
                      <dd className="mt-1 font-mono">{theme.colors.focusRing}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-widest">Motion surface</dt>
                      <dd className="mt-1 font-mono">{theme.motion.surface}</dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-widest">Motion press</dt>
                      <dd className="mt-1 font-mono">{theme.motion.press}</dd>
                    </div>
                  </dl>
                  <Link
                    href={`/docs/themes/${theme.name}`}
                    className="mt-4 inline-flex text-sm no-underline hover:underline"
                  >
                    Full {theme.label} reference →
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="semantic-roles-heading" className="py-10">
            <h2 id="semantic-roles-heading" className="text-2xl font-semibold">
              Semantic color roles
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              The roles below are the only surface area a primitive is allowed to touch.
              Re-skinning is a matter of remapping these nine keys — no component edits needed.
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[color:var(--color-divider)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-[color-mix(in_oklab,var(--color-divider)_60%,transparent)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['background', 'Solid fallback when Reduced Transparency collapses the glass.'],
                    ['textPrimary', 'Body copy on top of glass or a solid surface.'],
                    ['textSecondary', 'Muted text, captions, helper copy.'],
                    ['accent', 'Primary action surface.'],
                    ['onAccent', 'Label rendered on top of accent.'],
                    ['focusRing', 'Keyboard / switch-control focus ring.'],
                    ['divider', 'Hairlines, neutral borders, chip surfaces.'],
                    [
                      'danger',
                      'Invalid input rings, destructive controls. APCA-verified on every elevation.',
                    ],
                  ].map(([role, purpose]) => (
                    <tr
                      key={role}
                      className="border-t border-[color:var(--color-divider)] align-top"
                    >
                      <td className="px-4 py-3 font-mono text-xs">{role}</td>
                      <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">
                        {purpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="glass-recipe-heading" className="py-10">
            <h2 id="glass-recipe-heading" className="text-2xl font-semibold">
              Glass recipes
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              Each personality exposes four elevations. An elevation is a tint overlay, a blur
              radius, a backdrop saturation, a border color + width, and a noise opacity. Higher
              elevations sit on top — modals at 3, nav and tab bars at 2, cards at 1, inline chips
              at 0.
            </p>
            <CodeBlock
              language="ts"
              caption="packages/tokens/src/glass.ts"
              code={`export type GlassRecipe = {
  tint: string;            // rgba overlay painted on the blurred backdrop
  blurRadius: number;      // platform blur radius (dp)
  saturation: number;      // backdrop saturation multiplier
  borderColor: string;     // specular top border
  borderWidth: number;
  noiseOpacity: number;    // subtle grain to kill banding
};

export type GlassRecipes = Record<0 | 1 | 2 | 3, GlassRecipe>;`}
            />
            <p className="mt-4 text-sm text-[color:var(--color-text-secondary)]">
              The <InlineCode>resolveGlassRecipe</InlineCode> helper in{' '}
              <InlineCode>@absolute-ui/a11y</InlineCode> swaps the recipe for a solid surface when
              Reduced Transparency is on — the same gate every primitive goes through.
            </p>
          </section>

          <section aria-labelledby="spacing-heading" className="py-10">
            <h2 id="spacing-heading" className="text-2xl font-semibold">
              Spacing &amp; radius scales
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <TokenTable
                title="Spacing (dp)"
                rows={spacingEntries.map(([k, v]) => [k, String(v)])}
              />
              <TokenTable
                title="Radius (dp)"
                rows={radiusEntries.map(([k, v]) => [k, String(v)])}
              />
            </div>
          </section>

          <section aria-labelledby="motion-heading" className="py-10">
            <h2 id="motion-heading" className="text-2xl font-semibold">
              Motion personality
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              Springs are named, not numeric. Aurora's surface uses <InlineCode>gentle</InlineCode>{' '}
              while Sunset's uses <InlineCode>wobbly</InlineCode> — different physics is the whole
              point of a personality.
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[color:var(--color-divider)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-[color-mix(in_oklab,var(--color-divider)_60%,transparent)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Spring</th>
                    <th className="px-4 py-3 font-semibold">Stiffness</th>
                    <th className="px-4 py-3 font-semibold">Damping</th>
                    <th className="px-4 py-3 font-semibold">Mass</th>
                  </tr>
                </thead>
                <tbody>
                  {springEntries.map(([name, cfg]) => (
                    <tr key={name} className="border-t border-[color:var(--color-divider)]">
                      <td className="px-4 py-3 font-mono text-xs">{name}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-secondary)]">
                        {cfg.stiffness}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-secondary)]">
                        {cfg.damping}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-secondary)]">
                        {cfg.mass}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="switch-theme-heading" className="py-10">
            <h2 id="switch-theme-heading" className="text-2xl font-semibold">
              Switching the theme
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              Pass a different <InlineCode>Theme</InlineCode> to the provider. A live theme toggle
              is a one-state reducer away.
            </p>
            <CodeBlock
              language="tsx"
              caption="Theme toggle"
              code={`import { AbsoluteUIContext } from '@absolute-ui/core';
import { aurora, obsidian, frost, sunset, themes, type ThemeName } from '@absolute-ui/tokens';
import { useState } from 'react';

export function ThemedRoot({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<ThemeName>('aurora');
  const theme = themes[name];

  return (
    <AbsoluteUIContext.Provider
      value={{ theme, preferences: defaultPreferences }}
    >
      <ThemePicker value={name} onChange={setName} />
      {children}
    </AbsoluteUIContext.Provider>
  );
}`}
            />
          </section>

          <section aria-labelledby="custom-heading" className="py-10">
            <h2 id="custom-heading" className="text-2xl font-semibold">
              Building a custom personality
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              A theme is a TypeScript literal. Export your own, run the APCA contrast regression
              suite against it, and ship it alongside the built-ins.
            </p>
            <CodeBlock
              language="ts"
              caption="my-brand.theme.ts"
              code={`import type { Theme } from '@absolute-ui/tokens';

export const myBrand: Theme = {
  name: 'aurora', // reuse a name slot or extend ThemeName in a module declaration
  label: 'My Brand',
  dark: true,
  colors: {
    background: '#0B0F14',
    textPrimary: '#F7FAFC',
    textSecondary: '#B1BAC4',
    accent: '#5EE2C2',
    onAccent: '#0B0F14',
    focusRing: '#A6F0E0',
    divider: '#1D252E',
    danger: '#FFB4AB',
  },
  glass: {
    0: { tint: '#FFFFFF10', blurRadius: 12, saturation: 1.1, borderColor: '#FFFFFF22', borderWidth: 1, noiseOpacity: 0.04 },
    1: { tint: '#FFFFFF18', blurRadius: 18, saturation: 1.15, borderColor: '#FFFFFF30', borderWidth: 1, noiseOpacity: 0.05 },
    2: { tint: '#FFFFFF24', blurRadius: 24, saturation: 1.2, borderColor: '#FFFFFF3A', borderWidth: 1, noiseOpacity: 0.06 },
    3: { tint: '#FFFFFF30', blurRadius: 32, saturation: 1.25, borderColor: '#FFFFFF44', borderWidth: 1, noiseOpacity: 0.07 },
  },
  motion: { surface: 'gentle', press: 'snappy', overlay: 'standard' },
};`}
            />
            <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
              Run{' '}
              <InlineCode>pnpm --filter @absolute-ui/a11y test theme-contrast</InlineCode> to
              verify your palette meets |Lc| ≥ 60 on every elevation before shipping.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

function TokenTable({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[color:var(--color-divider)]">
      <div className="border-b border-[color:var(--color-divider)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-secondary)]">
        {title}
      </div>
      <table className="w-full border-collapse text-left text-sm">
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k} className="border-t border-[color:var(--color-divider)]">
              <td className="px-4 py-2 font-mono text-xs">{k}</td>
              <td className="px-4 py-2 font-mono text-xs text-[color:var(--color-text-secondary)]">
                {v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
