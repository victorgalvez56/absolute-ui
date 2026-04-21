import { STORYBOOK_BASE } from '@/lib/storybook';
import Link from 'next/link';

const primaryLinks = [
  { href: '/themes', label: 'Theme Lab' },
  { href: '/docs', label: 'Docs' },
  { href: '/docs/installation', label: 'Install' },
  { href: '/docs/theming', label: 'Theming' },
  { href: '/docs/accessibility', label: 'Accessibility' },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-[color:var(--color-divider)] bg-[color-mix(in_oklab,var(--color-background)_80%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold no-underline">
          <span
            aria-hidden
            className="inline-block h-6 w-6 rounded-md border border-white/40"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-focus-ring))',
            }}
          />
          <span>Absolute UI</span>
        </Link>
        <div className="hidden items-center gap-5 text-sm md:flex">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="no-underline hover:underline">
              {link.label}
            </Link>
          ))}
          <a
            href={STORYBOOK_BASE}
            target="_blank"
            rel="noreferrer"
            className="no-underline hover:underline"
          >
            Playground ↗
          </a>
        </div>
        <details className="relative md:hidden">
          <summary
            className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-[color:var(--color-divider)] px-3 py-1.5 text-sm [&::-webkit-details-marker]:hidden"
            aria-label="Open navigation menu"
          >
            <span aria-hidden className="text-base leading-none">
              ☰
            </span>
            Menu
          </summary>
          <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-[color:var(--color-divider)] bg-[color:var(--color-background)] p-2 shadow-xl">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm no-underline hover:bg-[color-mix(in_oklab,var(--color-divider)_50%,transparent)]"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={STORYBOOK_BASE}
              target="_blank"
              rel="noreferrer"
              className="block rounded-md px-3 py-2 text-sm no-underline hover:bg-[color-mix(in_oklab,var(--color-divider)_50%,transparent)]"
            >
              Playground ↗
            </a>
          </div>
        </details>
      </div>
    </nav>
  );
}
