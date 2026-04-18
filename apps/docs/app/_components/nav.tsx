import { LADLE_BASE } from '@/lib/ladle';
import Link from 'next/link';

export function Nav() {
  return (
    <nav className="sticky top-0 z-10 border-b border-[color:var(--color-divider)] bg-[color-mix(in_oklab,var(--color-background)_80%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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
        <div className="flex items-center gap-6 text-sm">
          <Link href="/docs" className="no-underline hover:underline">
            Docs
          </Link>
          <a
            href={LADLE_BASE}
            target="_blank"
            rel="noreferrer"
            className="no-underline hover:underline"
          >
            Playground
          </a>
        </div>
      </div>
    </nav>
  );
}
