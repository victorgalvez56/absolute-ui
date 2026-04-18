import { primitives, screens } from '@/lib/primitives';
import { themes } from '@absolute-ui/tokens';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '../_components/footer';
import { Nav } from '../_components/nav';

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'Absolute UI documentation — primitives, screens, and theme personalities, each linked to a live Ladle preview.',
};

function Card({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-[color:var(--color-divider)] p-4 no-underline transition-colors hover:border-[color:var(--color-accent)]"
    >
      <div className="font-semibold text-[color:var(--color-text-primary)]">{title}</div>
      <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{description}</p>
    </Link>
  );
}

export default function DocsIndexPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <header className="py-12">
          <p className="text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)]">
            Documentation
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Absolute UI reference</h1>
          <p className="mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
            Every primitive, screen, and personality has a dedicated page. Previews embed the real
            Ladle playground so you always see the production component, not a screenshot.
          </p>
        </header>

        <section aria-labelledby="primitives-heading" className="py-6">
          <h2 id="primitives-heading" className="text-xl font-semibold">
            Primitives
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            The eleven liquid-glass building blocks exported by{' '}
            <code className="rounded bg-[color:var(--color-divider)] px-1 py-0.5 text-xs">
              @absolute-ui/core
            </code>
            .
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {primitives.map((p) => (
              <li key={p.slug}>
                <Card href={`/docs/primitives/${p.slug}`} title={p.name} description={p.tagline} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="screens-heading" className="py-10">
          <h2 id="screens-heading" className="text-xl font-semibold">
            Screens
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            End-to-end compositions that exercise the full primitive set.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {screens.map((s) => (
              <li key={s.slug}>
                <Card href={`/docs/primitives/${s.slug}`} title={s.name} description={s.tagline} />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="themes-heading" className="py-10">
          <h2 id="themes-heading" className="text-xl font-semibold">
            Personalities
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            Each personality swaps semantic colors, glass recipes, and motion identity.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(themes).map((theme) => (
              <li key={theme.name}>
                <Card
                  href={`/docs/themes/${theme.name}`}
                  title={theme.label}
                  description={`${theme.dark ? 'Dark' : 'Light'} personality · accent ${theme.colors.accent}`}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
