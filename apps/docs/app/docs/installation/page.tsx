import { CodeBlock, InlineCode } from '@/app/_components/code-block';
import { DocsSidebar } from '@/app/_components/docs-sidebar';
import { Footer } from '@/app/_components/footer';
import { Nav } from '@/app/_components/nav';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Installation',
  description:
    'Install Absolute UI in an Expo or bare React Native app, wire the AbsoluteUIContext provider, and render your first GlassSurface.',
};

export default function InstallationPage() {
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
              Guide
            </p>
            <h1 className="mt-3 text-4xl font-semibold">Installation</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--color-text-secondary)]">
              Absolute UI targets React Native with Expo SDK 54+. The docs and Ladle playground run
              on React Native Web via the pnpm override, so everything you see in the browser is
              the production component — not a web mockup.
            </p>
          </header>

          <section aria-labelledby="prereq-heading" className="py-4">
            <h2 id="prereq-heading" className="text-xl font-semibold">
              Prerequisites
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[color:var(--color-text-secondary)]">
              <li>Node.js 20 or later.</li>
              <li>
                pnpm 9+ (the monorepo uses pnpm workspaces — npm / yarn will work for a consumer
                app, but this repo itself assumes pnpm).
              </li>
              <li>
                React Native 0.74+ or Expo SDK 54+. iOS 16+ and Android 13+ unlock the full glass
                recipes; older OS versions fall back gracefully.
              </li>
              <li>
                TypeScript 5.6+. The public API types rely on template-literal types and the{' '}
                <InlineCode>satisfies</InlineCode> operator.
              </li>
            </ul>
          </section>

          <section aria-labelledby="packages-heading" className="py-6">
            <h2 id="packages-heading" className="text-xl font-semibold">
              Packages
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
              Absolute UI ships as three workspace packages so consumers only pay for what they
              use.
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <InlineCode>@absolute-ui/core</InlineCode> — the primitives themselves. Depends on{' '}
                <InlineCode>@absolute-ui/tokens</InlineCode> and{' '}
                <InlineCode>@absolute-ui/a11y</InlineCode>.
              </li>
              <li>
                <InlineCode>@absolute-ui/tokens</InlineCode> — palette, spacing, radius, motion,
                typography, and the four personality themes (Aurora, Obsidian, Frost, Sunset).
              </li>
              <li>
                <InlineCode>@absolute-ui/a11y</InlineCode> — APCA contrast, Reduced Motion / Reduced
                Transparency resolvers, and focus-ring tokens. Import directly if you want to build
                custom primitives that honour the same contracts.
              </li>
            </ul>
          </section>

          <section aria-labelledby="install-heading" className="py-6">
            <h2 id="install-heading" className="text-xl font-semibold">
              Install
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
              Absolute UI is pre-alpha and is not yet published to npm. Today you consume it from
              this workspace — the commands below will work once the packages land on the
              registry.
            </p>
            <CodeBlock
              language="sh"
              caption="pnpm"
              code={`pnpm add @absolute-ui/core @absolute-ui/tokens @absolute-ui/a11y
pnpm add -D react-native`}
            />
            <CodeBlock
              language="sh"
              caption="npm / yarn"
              code={`npm install @absolute-ui/core @absolute-ui/tokens @absolute-ui/a11y
# or
yarn add @absolute-ui/core @absolute-ui/tokens @absolute-ui/a11y`}
            />
          </section>

          <section aria-labelledby="provider-heading" className="py-6">
            <h2 id="provider-heading" className="text-xl font-semibold">
              Provide the theme and accessibility preferences
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              Every primitive reads from <InlineCode>AbsoluteUIContext</InlineCode> instead of
              touching <InlineCode>AccessibilityInfo</InlineCode> directly, so tests, stories, and
              the eventual native app can all inject preferences the same way. Wrap your app once:
            </p>
            <CodeBlock
              language="tsx"
              caption="app/_layout.tsx"
              code={`import { AbsoluteUIContext } from '@absolute-ui/core';
import { aurora } from '@absolute-ui/tokens';
import { defaultPreferences } from '@absolute-ui/a11y';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <AbsoluteUIContext.Provider
      value={{
        theme: aurora,
        preferences: defaultPreferences,
      }}
    >
      {children}
    </AbsoluteUIContext.Provider>
  );
}`}
            />
            <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
              In a production app you will wire <InlineCode>preferences</InlineCode> to{' '}
              <InlineCode>AccessibilityInfo</InlineCode> listeners so Reduced Motion / Reduced
              Transparency / Bold Text update live. That wiring ships with the Phase 4 motion
              layer.
            </p>
          </section>

          <section aria-labelledby="first-component-heading" className="py-6">
            <h2 id="first-component-heading" className="text-xl font-semibold">
              Your first primitive
            </h2>
            <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
              Compose anything on top of <InlineCode>GlassSurface</InlineCode> or reach for one of
              the higher-level primitives.
            </p>
            <CodeBlock
              language="tsx"
              caption="Hello world"
              code={`import { GlassCard, GlassButton } from '@absolute-ui/core';

export function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <GlassCard>
      <GlassCard.Header
        title="Welcome"
        subtitle="Four personalities, twelve primitives, one contract."
      />
      <GlassCard.Body>
        <Text>Open the playground to see every state on every theme.</Text>
      </GlassCard.Body>
      <GlassCard.Footer>
        <GlassButton accessibilityLabel="Start" onPress={onStart}>
          Start
        </GlassButton>
      </GlassCard.Footer>
    </GlassCard>
  );
}`}
            />
          </section>

          <section aria-labelledby="next-steps-heading" className="py-6">
            <h2 id="next-steps-heading" className="text-xl font-semibold">
              Next steps
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/docs/theming" className="no-underline hover:underline">
                  Theming &amp; tokens →
                </Link>{' '}
                — the four personalities, glass recipes, and how to build your own.
              </li>
              <li>
                <Link href="/docs/accessibility" className="no-underline hover:underline">
                  Accessibility guide →
                </Link>{' '}
                — the APCA contract, the VoiceOver / TalkBack scripts, and the a11y checklist for
                every primitive.
              </li>
              <li>
                <Link href="/docs" className="no-underline hover:underline">
                  Primitive index →
                </Link>{' '}
                — props, variants, and examples for all twelve primitives.
              </li>
            </ul>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
