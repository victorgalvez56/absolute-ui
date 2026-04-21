import { CodeBlock, InlineCode } from '@/app/_components/code-block';
import { DocsSidebar } from '@/app/_components/docs-sidebar';
import { Footer } from '@/app/_components/footer';
import { Nav } from '@/app/_components/nav';
import { SlugPlayground } from '@/app/_components/playground/SlugPlayground';
import { hasDemo } from '@/lib/demos';
import { storybookPreviewUrl, storybookStoryUrl } from '@/lib/storybook';
import {
  findPrimitive,
  findScreen,
  primitives,
  screens,
  type PropRow,
} from '@/lib/primitives';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
  const screen = findScreen(slug);
  const entry = primitive ?? screen;
  if (!entry) return { title: 'Not found' };
  return {
    title: entry.name,
    description: entry.tagline,
  };
}

function PropTable({ rows }: { rows: PropRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="mt-3 rounded-xl border border-dashed border-[color:var(--color-divider)] p-4 text-sm text-[color:var(--color-text-secondary)]">
        No props. Stateless helper.
      </p>
    );
  }
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-[color:var(--color-divider)]">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead className="bg-[color-mix(in_oklab,var(--color-divider)_60%,transparent)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Default</th>
            <th className="px-4 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((prop) => (
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
  );
}

export default async function PrimitivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const primitive = findPrimitive(slug);
  const screen = findScreen(slug);
  const entry = primitive ?? screen;
  if (!entry) notFound();

  const previewUrl = storybookPreviewUrl(entry.storyId);
  const externalUrl = storybookStoryUrl(entry.storyId);

  return (
    <>
      <Nav />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:flex-row lg:gap-10">
        <DocsSidebar />
        <main className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="pt-8 text-sm">
            <Link
              href="/docs"
              className="text-[color:var(--color-text-secondary)] no-underline hover:underline"
            >
              ← All docs
            </Link>
          </nav>
          <header className="py-6">
            <div className="flex items-center gap-3">
              {primitive ? (
                <span className="rounded-full border border-[color:var(--color-divider)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[color:var(--color-text-secondary)]">
                  Phase {primitive.phase}
                </span>
              ) : (
                <span className="rounded-full border border-[color:var(--color-divider)] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[color:var(--color-text-secondary)]">
                  Screen
                </span>
              )}
              <span className="text-xs text-[color:var(--color-text-secondary)]">
                <InlineCode>@absolute-ui/core</InlineCode>
              </span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold">{entry.name}</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--color-text-secondary)]">
              {entry.tagline}
            </p>
          </header>

          {primitive ? (
            <section aria-labelledby="overview-heading" className="py-4">
              <h2 id="overview-heading" className="text-lg font-semibold">
                Overview
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {primitive.overview}
              </p>
            </section>
          ) : screen ? (
            <section aria-labelledby="overview-heading" className="py-4">
              <h2 id="overview-heading" className="text-lg font-semibold">
                Overview
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {screen.description}
              </p>
            </section>
          ) : null}

          <section aria-labelledby="preview-heading" className="py-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 id="preview-heading" className="text-lg font-semibold">
                {hasDemo(slug) ? 'Interactive demo' : 'Live preview'}
              </h2>
              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm no-underline hover:underline"
              >
                Open in Storybook ↗
              </a>
            </div>
            {hasDemo(slug) ? (
              <SlugPlayground slug={slug} />
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[color:var(--color-divider)] bg-black/20">
                <iframe
                  title={`${entry.name} live preview`}
                  src={previewUrl}
                  className="block h-[520px] w-full border-0"
                  loading="lazy"
                />
              </div>
            )}
          </section>

          {primitive ? (
            <>
              <section aria-labelledby="props-heading" className="py-8">
                <h2 id="props-heading" className="text-lg font-semibold">
                  Props
                </h2>
                {primitive.props ? (
                  <PropTable rows={primitive.props} />
                ) : (
                  <p className="mt-3 rounded-xl border border-dashed border-[color:var(--color-divider)] p-6 text-sm text-[color:var(--color-text-secondary)]">
                    Prop table coming soon. Use the live preview above or the source in{' '}
                    <InlineCode>@absolute-ui/core</InlineCode> while we finish writing the
                    reference.
                  </p>
                )}
              </section>

              {primitive.slotProps && primitive.slotProps.length > 0 ? (
                <section aria-labelledby="slots-heading" className="py-6">
                  <h2 id="slots-heading" className="text-lg font-semibold">
                    Compound slots
                  </h2>
                  {primitive.slotProps.map((slot) => (
                    <div key={slot.name} className="mt-5">
                      <h3 className="font-mono text-sm">{slot.name}</h3>
                      <PropTable rows={slot.props} />
                    </div>
                  ))}
                </section>
              ) : null}

              {primitive.examples.length > 0 ? (
                <section aria-labelledby="examples-heading" className="py-8">
                  <h2 id="examples-heading" className="text-lg font-semibold">
                    Examples
                  </h2>
                  <div className="mt-4 space-y-8">
                    {primitive.examples.map((example) => (
                      <article key={example.title}>
                        <h3 className="text-base font-semibold">{example.title}</h3>
                        <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                          {example.description}
                        </p>
                        <CodeBlock code={example.code} />
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              {primitive.variants.length > 0 ? (
                <section aria-labelledby="variants-heading" className="py-8">
                  <h2 id="variants-heading" className="text-lg font-semibold">
                    Variants
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                    Stories exercised in the Storybook playground.
                  </p>
                  <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    {primitive.variants.map((variant) => {
                      const href = variant.storyId
                        ? storybookStoryUrl(variant.storyId)
                        : undefined;
                      const card = (
                        <div className="h-full rounded-xl border border-[color:var(--color-divider)] p-4 transition-colors hover:border-[color:var(--color-accent)]">
                          <div className="font-semibold">{variant.name}</div>
                          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                            {variant.description}
                          </p>
                          {href ? (
                            <span className="mt-3 inline-block text-xs text-[color:var(--color-accent)]">
                              Open story ↗
                            </span>
                          ) : null}
                        </div>
                      );
                      return (
                        <li key={variant.name}>
                          {href ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="block no-underline"
                            >
                              {card}
                            </a>
                          ) : (
                            card
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null}

              {primitive.accessibility.length > 0 ? (
                <section aria-labelledby="a11y-heading" className="py-8">
                  <h2 id="a11y-heading" className="text-lg font-semibold">
                    Accessibility
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {primitive.accessibility.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 rounded-lg border border-[color:var(--color-divider)] p-3"
                      >
                        <span
                          aria-hidden
                          className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full"
                          style={{ background: 'var(--color-accent)' }}
                        />
                        <span className="text-[color:var(--color-text-secondary)]">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm">
                    See the{' '}
                    <Link href="/docs/accessibility" className="no-underline hover:underline">
                      accessibility guide
                    </Link>{' '}
                    for the project-wide contract and testing scripts.
                  </p>
                </section>
              ) : null}
            </>
          ) : null}
        </main>
      </div>
      <Footer />
    </>
  );
}
