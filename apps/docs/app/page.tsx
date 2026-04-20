import { STORYBOOK_BASE } from '@/lib/storybook';
import { primitives } from '@/lib/primitives';
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import Link from 'next/link';
import { Footer } from './_components/footer';
import { InlineCode } from './_components/code-block';
import { Nav } from './_components/nav';
import { ThemeSwatch } from './_components/theme-swatch';

const allThemes = [aurora, obsidian, frost, sunset];

const contractCards = [
  {
    title: 'APCA contrast on glass',
    body: '|Lc| ≥ 60 for textPrimary and textSecondary on every elevation of every personality. The contract is enforced by a regression suite in @absolute-ui/a11y, not a style-guide PDF.',
  },
  {
    title: '44×44pt hit targets',
    body: 'Every pressable primitive — button, tab, switch, picker segment, slider thumb — lays out with a minimum 44pt touch area. Enforced in each style.ts, not hoped for in design review.',
  },
  {
    title: 'Reduced Transparency',
    body: 'When the OS preference is on, glass collapses to a solid theme surface and modal scrims bump their alpha so the modal cue survives. Driven by @absolute-ui/a11y, not hand-coded per component.',
  },
  {
    title: 'Reduced Motion',
    body: 'Motion resolvers swap springs for instant transitions when the user opts out. Today the motion layer is a no-op (Phase 4), but the gate is already wired end-to-end.',
  },
  {
    title: '120fps floor',
    body: 'The performance budget lives in @absolute-ui/core — Reassure threshold ±5%, Flashlight ≥ 90 on Pixel 6a, frame time p95 < 16ms. CI gates PRs, not commit messages.',
  },
  {
    title: 'Bundle under 50KB / primitive',
    body: 'Each primitive is measured and gated on a gzipped-size diff. Shared helpers land in @absolute-ui/a11y and @absolute-ui/tokens so the same util is not shipped twice.',
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section className="pt-12 pb-12 sm:pt-20 sm:pb-16">
          <p className="text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)]">
            Liquid glass, for real devices
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            A React Native design system where performance and accessibility are CI contracts.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-text-secondary)]">
            Absolute UI ships four personalities, twelve glass primitives, and APCA-verified
            contrast on every elevation. Every commit enforces the same a11y and performance floors
            the components were designed to.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/themes"
              className="inline-flex h-11 items-center rounded-full bg-[color:var(--color-accent)] px-6 font-semibold no-underline"
              style={{ color: 'var(--color-on-accent)' }}
            >
              Try the Theme Lab
            </Link>
            <Link
              href="/docs/installation"
              className="inline-flex h-11 items-center rounded-full border border-[color:var(--color-divider)] px-6 font-semibold no-underline"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Get started
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-full border border-[color:var(--color-divider)] px-6 font-semibold no-underline"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Browse the docs
            </Link>
            <a
              href={STORYBOOK_BASE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-[color:var(--color-divider)] px-6 font-semibold no-underline"
            >
              Live playground ↗
            </a>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
            Install with <InlineCode>pnpm add @absolute-ui/core @absolute-ui/tokens</InlineCode> —
            pre-alpha, nothing ships yet.
          </p>
        </section>

        <section aria-labelledby="themes-heading" className="py-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 id="themes-heading" className="text-2xl font-semibold">
                Four personalities
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                Themes swap semantic colors, glass recipes, and motion identity — not just hues.
              </p>
            </div>
            <Link href="/themes" className="text-sm no-underline hover:underline">
              Open the Theme Lab →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allThemes.map((theme) => (
              <ThemeSwatch key={theme.name} theme={theme} />
            ))}
          </div>
        </section>

        <section aria-labelledby="contracts-heading" className="py-10">
          <h2 id="contracts-heading" className="text-2xl font-semibold">
            Contracts, not aspirations
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
            Every constraint below is enforced automatically. If a PR breaks one, CI blocks the
            merge — there is no "we will fix it later" path.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contractCards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-[color:var(--color-divider)] p-5"
              >
                <h3 className="text-base font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="primitives-heading" className="py-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 id="primitives-heading" className="text-2xl font-semibold">
                Twelve primitives across three phases
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                Core surfaces, navigation, and inputs — each composes a GlassSurface, meets the
                44pt hit-target floor, and enforces APCA |Lc| ≥ 60 on its label.
              </p>
            </div>
            <Link href="/docs" className="text-sm no-underline hover:underline">
              Full index →
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {primitives.slice(0, 9).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/docs/primitives/${p.slug}`}
                  className="block h-full rounded-xl border border-[color:var(--color-divider)] p-4 no-underline transition-colors hover:border-[color:var(--color-accent)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-[color:var(--color-text-primary)]">
                      {p.name}
                    </div>
                    <span className="text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
                      Phase {p.phase}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                    {p.tagline}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
