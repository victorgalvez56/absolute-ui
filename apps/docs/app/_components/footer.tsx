import { LADLE_BASE } from '@/lib/ladle';
import Link from 'next/link';

const columns = [
  {
    label: 'Documentation',
    links: [
      { label: 'Overview', href: '/docs' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Theming & tokens', href: '/docs/theming' },
      { label: 'Accessibility', href: '/docs/accessibility' },
    ],
  },
  {
    label: 'Primitives',
    links: [
      { label: 'GlassSurface', href: '/docs/primitives/glass-surface' },
      { label: 'GlassButton', href: '/docs/primitives/glass-button' },
      { label: 'GlassCard', href: '/docs/primitives/glass-card' },
      { label: 'GlassSheet', href: '/docs/primitives/glass-sheet' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[color:var(--color-divider)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-12 text-sm text-[color:var(--color-text-secondary)] sm:grid-cols-3">
        <div>
          <div className="font-semibold text-[color:var(--color-text-primary)]">Absolute UI</div>
          <p className="mt-2 max-w-xs">
            Liquid-glass React Native design system. Performance and accessibility are CI
            contracts — not aspirational bullets on a marketing page.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.label}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest">
              {col.label}
            </div>
            <ul className="space-y-1">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="no-underline hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[color:var(--color-divider)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 text-xs text-[color:var(--color-text-secondary)]">
          <span>Pre-alpha · nothing ships yet · built in the open.</span>
          <a href={LADLE_BASE} target="_blank" rel="noreferrer" className="no-underline">
            Live playground ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
