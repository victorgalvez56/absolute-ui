import { DocsSidebar } from '@/app/_components/docs-sidebar';
import { type Theme, themes } from '@absolute-ui/tokens';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Footer } from '../../../_components/footer';
import { Nav } from '../../../_components/nav';

type Params = { slug: string };

const themeSlugs: string[] = Object.keys(themes);

export function generateStaticParams(): Params[] {
  return themeSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = (themes as Record<string, Theme | undefined>)[slug];
  if (!theme) return { title: 'Not found' };
  return {
    title: `${theme.label} theme`,
    description: `Absolute UI ${theme.label} personality: ${theme.dark ? 'dark' : 'light'} theme with accent ${theme.colors.accent}.`,
  };
}

function ColorRow({ role, value }: { role: string; value: string }) {
  return (
    <tr className="border-t border-[color:var(--color-divider)]">
      <td className="px-4 py-3 font-mono text-xs">{role}</td>
      <td className="px-4 py-3">
        <span
          className="inline-block h-6 w-6 rounded-md border border-white/20 align-middle"
          style={{ backgroundColor: value }}
          aria-hidden
        />
        <span className="ml-3 font-mono text-xs">{value}</span>
      </td>
    </tr>
  );
}

export default async function ThemePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const theme = (themes as Record<string, Theme | undefined>)[slug];
  if (!theme) notFound();

  const colorEntries = Object.entries(theme.colors) as Array<[string, string]>;

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
          <p className="text-sm uppercase tracking-widest text-[color:var(--color-text-secondary)]">
            Personality · {theme.dark ? 'Dark' : 'Light'}
          </p>
          <h1 className="mt-3 text-4xl font-semibold">{theme.label}</h1>
          <p className="mt-3 max-w-2xl text-[color:var(--color-text-secondary)]">
            Motion identity: surface <code>{theme.motion.surface}</code> · press{' '}
            <code>{theme.motion.press}</code> · overlay <code>{theme.motion.overlay}</code>.
          </p>
        </header>

        <section
          aria-labelledby="preview-heading"
          className="overflow-hidden rounded-2xl border border-[color:var(--color-divider)]"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.textPrimary,
          }}
        >
          <div
            className="p-10"
            style={{
              backgroundImage: `radial-gradient(900px at 20% 20%, ${theme.colors.accent}55 0%, transparent 55%), radial-gradient(700px at 85% 80%, ${theme.colors.focusRing}44 0%, transparent 60%)`,
            }}
          >
            <h2 id="preview-heading" className="text-2xl font-semibold">
              {theme.label} in context
            </h2>
            <p className="mt-2" style={{ color: theme.colors.textSecondary }}>
              This preview uses only colors resolved from the theme so you see the actual
              text/accent/background composition.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span
                className="inline-flex h-11 items-center rounded-full px-5 font-semibold"
                style={{
                  backgroundColor: theme.colors.accent,
                  color: theme.colors.onAccent,
                }}
              >
                Primary action
              </span>
              <span
                className="inline-flex h-11 items-center rounded-full border px-5 font-semibold"
                style={{ borderColor: theme.colors.divider }}
              >
                Secondary
              </span>
            </div>
          </div>
        </section>

        <section aria-labelledby="colors-heading" className="py-10">
          <h2 id="colors-heading" className="text-xl font-semibold">
            Colors
          </h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[color:var(--color-divider)]">
            <table className="w-full min-w-[420px] border-collapse text-left text-sm">
              <thead className="bg-[color-mix(in_oklab,var(--color-divider)_60%,transparent)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {colorEntries.map(([role, value]) => (
                  <ColorRow key={role} role={role} value={value} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="glass-heading" className="py-6">
          <h2 id="glass-heading" className="text-xl font-semibold">
            Glass recipes
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
            Four elevations, each with its own tint, blur, saturation, border, and noise opacity.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([0, 1, 2, 3] as const).map((elevation) => {
              const recipe = theme.glass[elevation];
              return (
                <div
                  key={elevation}
                  className="rounded-xl border border-[color:var(--color-divider)] p-4 text-xs"
                >
                  <div className="mb-2 font-semibold">Elevation {elevation}</div>
                  <dl className="space-y-1 font-mono text-[color:var(--color-text-secondary)]">
                    <div>tint: {recipe.tint}</div>
                    <div>blur: {recipe.blurRadius}</div>
                    <div>saturation: {recipe.saturation}</div>
                    <div>border: {recipe.borderColor}</div>
                    <div>noise: {recipe.noiseOpacity}</div>
                  </dl>
                </div>
              );
            })}
          </div>
        </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
