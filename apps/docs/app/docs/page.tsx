import { DocsSidebar } from '@/app/_components/docs-sidebar';
import { Footer } from '@/app/_components/footer';
import { Nav } from '@/app/_components/nav';
import { InlineCode } from '@/app/_components/code-block';
import { phaseSections, primitives, screens } from '@/lib/primitives';
import { themes } from '@absolute-ui/tokens';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'Absolute UI documentation — primitives, screens, personalities, and the a11y + performance contracts, each linked to a live Storybook preview.',
};

const guideCards = [
  {
    href: '/docs/installation',
    title: 'Installation',
    body: 'Packages, provider setup, and your first primitive.',
  },
  {
    href: '/docs/theming',
    title: 'Theming & tokens',
    body: 'The four personalities, semantic roles, glass recipes, and motion identity.',
  },
  {
    href: '/docs/accessibility',
    title: 'Accessibility',
    body: 'APCA contract, hit targets, preferences, and the VO / TalkBack scripts.',
  },
];

function Card({
  href,
  title,
  description,
  trailing,
}: {
  href: string;
  title: string;
  description: string;
  trailing?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block h-full rounded-xl border border-[color:var(--color-divider)] p-4 no-underline transition-colors hover:border-[color:var(--color-accent)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-[color:var(--color-text-primary)]">{title}</span>
        {trailing ? (
          <span className="text-xs uppercase tracking-widest text-[color:var(--color-text-secondary)]">
            {trailing}
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">{description}</p>
    </Link>
  );
}

export default function DocsIndexPage() {
  const sections = phaseSections();
  return (
    <>
      <Nav />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:flex-row lg:gap-10">
        <DocsSidebar />
        <main className="min-w-0 flex-1">
          <header className="py-8 lg:py-12">
            <p className="text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)]">
              Documentation
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Absolute UI reference</h1>
            <p className="mt-4 max-w-2xl text-[color:var(--color-text-secondary)]">
              Every primitive, screen, and personality has a dedicated page. Previews embed the
              real Storybook playground so you always see the production component, not a screenshot.
              Start with the guides, or jump straight to a primitive from the sidebar.
            </p>
            <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
              Tip: the repo root has <InlineCode>IMPLEMENTATION_PLAN.md</InlineCode> for the phased
              roadmap and <InlineCode>PHASE_1_SUMMARY.md</InlineCode> for the current shipped
              surface.
            </p>
          </header>

          <section aria-labelledby="guides-heading" className="py-4">
            <h2 id="guides-heading" className="text-xl font-semibold">
              Guides
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {guideCards.map((g) => (
                <li key={g.href}>
                  <Card href={g.href} title={g.title} description={g.body} />
                </li>
              ))}
            </ul>
          </section>

          {sections.map((section) => {
            const phaseNumber = section.label.match(/Phase (\d)/)?.[1];
            return (
              <section
                key={section.label}
                aria-label={section.label}
                className="py-8"
              >
                <h2 className="text-xl font-semibold">{section.label}</h2>
                <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                  {phaseNumber === '1'
                    ? 'The core surfaces — GlassSurface and three compositions on top of it.'
                    : phaseNumber === '2'
                      ? 'Navigation family — nav bar, tab bar, centered modal, transient toast.'
                      : 'Inputs — text, switch, slider, segmented picker.'}
                </p>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.entries.map((entry) => {
                    const p = primitives.find((x) => x.slug === entry.slug);
                    if (!p) return null;
                    return (
                      <li key={entry.slug}>
                        <Card
                          href={entry.href}
                          title={p.name}
                          description={p.tagline}
                          trailing={`Phase ${p.phase}`}
                        />
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          <section aria-labelledby="screens-heading" className="py-8">
            <h2 id="screens-heading" className="text-xl font-semibold">
              Example screens
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
              End-to-end compositions that exercise the full primitive set.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {screens.map((s) => (
                <li key={s.slug}>
                  <Card
                    href={`/docs/primitives/${s.slug}`}
                    title={s.name}
                    description={s.tagline}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="themes-heading" className="py-8">
            <h2 id="themes-heading" className="text-xl font-semibold">
              Personalities
            </h2>
            <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
              Each personality swaps semantic colors, glass recipes, and motion identity.
              Start with the <Link href="/docs/theming" className="no-underline hover:underline">theming guide</Link>.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Object.values(themes).map((theme) => (
                <li key={theme.name}>
                  <Card
                    href={`/docs/themes/${theme.name}`}
                    title={theme.label}
                    description={`${theme.dark ? 'Dark' : 'Light'} · accent ${theme.colors.accent}`}
                  />
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
