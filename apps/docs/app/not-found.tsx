import Link from 'next/link';
import { Footer } from './_components/footer';
import { Nav } from './_components/nav';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)]">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold">Page not found</h1>
        <p className="mt-4 text-[color:var(--color-text-secondary)]">
          This page either moved or never existed.
        </p>
        <Link
          href="/docs"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-[color:var(--color-accent)] px-6 font-semibold text-[color:var(--color-on-accent)] no-underline"
        >
          Browse the docs
        </Link>
      </main>
      <Footer />
    </>
  );
}
