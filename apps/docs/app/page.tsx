import { LADLE_BASE } from '@/lib/ladle';
import { primitives } from '@/lib/primitives';
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import Link from 'next/link';
import { Footer } from './_components/footer';
import { Nav } from './_components/nav';
import { ThemeSwatch } from './_components/theme-swatch';

const allThemes = [aurora, obsidian, frost, sunset];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section className="pt-20 pb-16">
          <p className="text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)]">
            Liquid glass, for real devices
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight sm:text-6xl">
            A React Native design system where performance and accessibility are CI contracts.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-text-secondary)]">
            Absolute UI ships four personalities, eleven glass primitives, and APCA-verified
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
            <a
              href={LADLE_BASE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-full border border-[color:var(--color-divider)] px-6 font-semibold no-underline"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Live playground
            </a>
            <Link
              href="/docs"
              className="inline-flex h-11 items-center rounded-full border border-[color:var(--color-divider)] px-6 font-semibold no-underline"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Browse the docs
            </Link>
          </div>
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

        <section aria-labelledby="primitives-heading" className="py-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 id="primitives-heading" className="text-2xl font-semibold">
                Eleven primitives
              </h2>
              <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
                Each one composes a GlassSurface, meets the 44pt hit-target floor, and enforces APCA
                |Lc| ≥ 60 on its label.
              </p>
            </div>
            <Link href="/docs" className="text-sm no-underline hover:underline">
              Full index →
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {primitives.slice(0, 6).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/docs/primitives/${p.slug}`}
                  className="block rounded-xl border border-[color:var(--color-divider)] p-4 no-underline transition-colors hover:border-[color:var(--color-accent)]"
                >
                  <div className="font-semibold text-[color:var(--color-text-primary)]">
                    {p.name}
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
