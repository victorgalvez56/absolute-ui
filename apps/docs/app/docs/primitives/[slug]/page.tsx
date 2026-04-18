import { LADLE_BASE, ladlePreviewUrl } from '@/lib/ladle';
import { findPrimitive, primitives, screens } from '@/lib/primitives';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '../../../_components/footer';
import { Nav } from '../../../_components/nav';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return [...primitives, ...screens].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const primitive = findPrimitive(slug);
  const screen = screens.find((s) => s.slug === slug);
  const entry = primitive ?? screen;
  if (!entry) return { title: 'Not found' };
  return {
    title: entry.name,
    description: entry.tagline,
  };
}

export default async function PrimitivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const primitive = findPrimitive(slug);
  const screen = screens.find((s) => s.slug === slug);
  const entry = primitive ?? screen;
  if (!entry) notFound();

  const previewUrl = ladlePreviewUrl(entry.storyId);
  const externalUrl = `${LADLE_BASE}/?story=${encodeURIComponent(entry.storyId)}`;
  const props = primitive?.props ?? null;

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <nav aria-label="Breadcrumb" className="pt-8 text-sm">
          <Link
            href="/docs"
            className="text-[color:var(--color-text-secondary)] no-underline hover:underline"
          >
            ← All docs
          </Link>
        </nav>
        <header className="py-6">
          <h1 className="text-4xl font-semibold">{entry.name}</h1>
          <p className="mt-3 max-w-2xl text-[color:var(--color-text-secondary)]">{entry.tagline}</p>
        </header>

        <section aria-labelledby="preview-heading" className="py-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="preview-heading" className="text-lg font-semibold">
              Live preview
            </h2>
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm no-underline hover:underline"
            >
              Open in Ladle ↗
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[color:var(--color-divider)] bg-black/20">
            <iframe
              title={`${entry.name} live preview`}
              src={previewUrl}
              className="block h-[520px] w-full border-0"
              loading="lazy"
            />
          </div>
        </section>

        <section aria-labelledby="props-heading" className="py-10">
          <h2 id="props-heading" className="text-lg font-semibold">
            Props
          </h2>
          {props ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-[color:var(--color-divider)]">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[color-mix(in_oklab,var(--color-divider)_60%,transparent)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Default</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {props.map((prop) => (
                    <tr
                      key={prop.name}
                      className="border-t border-[color:var(--color-divider)] align-top"
                    >
                      <td className="px-4 py-3 font-mono text-xs">
                        {prop.name}
                        {prop.required ? (
                          <span
                            className="ml-1 text-[color:var(--color-danger)]"
                            aria-label="required"
                          >
                            *
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-secondary)]">
                        {prop.type}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-secondary)]">
                        {prop.default ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">
                        {prop.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-[color:var(--color-divider)] p-6 text-sm text-[color:var(--color-text-secondary)]">
              Prop table coming soon. Use the live preview above or the source in{' '}
              <code className="rounded bg-[color:var(--color-divider)] px-1 py-0.5">
                @absolute-ui/core
              </code>{' '}
              while we finish writing the reference.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
