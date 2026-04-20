import { phaseSections, screens } from '@/lib/primitives';
import Link from 'next/link';

const guides = [
  { slug: 'overview', name: 'Overview', href: '/docs' },
  { slug: 'installation', name: 'Installation', href: '/docs/installation' },
  { slug: 'theming', name: 'Theming & tokens', href: '/docs/theming' },
  { slug: 'accessibility', name: 'Accessibility', href: '/docs/accessibility' },
];

type Entry = { slug: string; name: string; href: string };
type Group = { label: string; entries: Entry[] };

function buildGroups(): Group[] {
  const primitiveSections = phaseSections();
  return [
    { label: 'Guides', entries: guides },
    ...primitiveSections,
    {
      label: 'Example screens',
      entries: screens.map((s) => ({
        slug: s.slug,
        name: s.name,
        href: `/docs/primitives/${s.slug}`,
      })),
    },
  ];
}

/**
 * Shared docs navigation. Renders as a collapsible disclosure on small
 * screens (so mobile users can reach every page without a client-side
 * drawer component) and a sticky left rail on large screens.
 */
export function DocsSidebar() {
  const groups = buildGroups();
  return (
    <>
      <details className="group w-full border-b border-[color:var(--color-divider)] lg:hidden">
        <summary
          aria-label="Open documentation menu"
          className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="text-base leading-none">
              ☰
            </span>
            Documentation menu
          </span>
          <span
            aria-hidden
            className="text-xs text-[color:var(--color-text-secondary)] transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="pb-4 pt-2 text-sm">
          {groups.map((group) => (
            <SidebarGroup key={group.label} {...group} />
          ))}
        </div>
      </details>
      <aside
        aria-label="Documentation navigation"
        className="sticky top-[72px] hidden max-h-[calc(100vh-80px)] w-56 shrink-0 overflow-y-auto border-r border-[color:var(--color-divider)] pr-6 pt-8 text-sm lg:block"
      >
        {groups.map((group) => (
          <SidebarGroup key={group.label} {...group} />
        ))}
      </aside>
    </>
  );
}

function SidebarGroup({ label, entries }: Group) {
  return (
    <div className="mb-6 lg:mb-8">
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-secondary)]">
        {label}
      </div>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={entry.href}
              className="block rounded-md px-2 py-1 no-underline hover:bg-[color-mix(in_oklab,var(--color-divider)_50%,transparent)]"
            >
              {entry.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
