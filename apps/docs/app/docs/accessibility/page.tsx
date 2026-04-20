import { CodeBlock, InlineCode } from '@/app/_components/code-block';
import { DocsSidebar } from '@/app/_components/docs-sidebar';
import { Footer } from '@/app/_components/footer';
import { Nav } from '@/app/_components/nav';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility',
  description:
    'The Absolute UI a11y contract — APCA |Lc| ≥ 60 on glass, 44pt hit targets, Reduced Motion and Reduced Transparency resolvers, and the VoiceOver / TalkBack scripts shipped with every primitive.',
};

const checklist = [
  {
    title: 'Role + accessible label on every primitive',
    body: 'Every primitive sets an explicit accessibility role (button, header, switch, radiogroup) and accepts an accessibilityLabel override. When no override is passed, the visible label or string child is used.',
  },
  {
    title: '44×44pt minimum hit target',
    body: 'Layouts in style.ts enforce the 44pt floor regardless of label length. Tab bars, sliders, switches, and pickers all pad their interactive row to 44pt, not the glyph bounds.',
  },
  {
    title: 'Dynamic Type scales without clipping',
    body: 'Line-heights default to "snug" so titles and subtitles grow proportionally at the accessibility maximum. The card header trailing slot anchors to the top of the row so it never overlaps a wrapped title.',
  },
  {
    title: 'Reduced Transparency fallback',
    body: 'resolveGlassRecipe swaps the translucent recipe for the theme background when the preference is on. Scrims bump their alpha so the modal cue survives the solidification.',
  },
  {
    title: 'Reduced Motion fallback',
    body: 'resolveSpring returns an instant spring when the preference is on. Today Phase 1 has no animation so the resolvers are no-ops, but the gate is already wired through.',
  },
  {
    title: 'APCA |Lc| ≥ 60 on glass',
    body: 'The theme-contrast regression suite composites textPrimary and textSecondary onto every elevation of every personality and asserts |Lc| ≥ 60. A failing palette is a CI failure, not a design review note.',
  },
  {
    title: 'Visible focus ring',
    body: 'Pressable components render a 2px focus ring in theme.colors.focusRing whenever Pressable.focused is true, and suppress it when disabled. Web preview respects :focus-visible.',
  },
  {
    title: 'No color-only state',
    body: 'Tab bar selection uses weight + underline as well as color. Input invalid state changes the ring color and adds accessibilityState.invalid. Toast variants paint a structural stripe, but the message itself is the accessible name.',
  },
  {
    title: 'VoiceOver + TalkBack scripts per primitive',
    body: 'Every non-trivial primitive ships a TESTING.md script covering VoiceOver, TalkBack, Reduced Transparency, and Larger Text. Shipping a change that breaks one of the sign-off checklists is a block.',
  },
  {
    title: 'Works at 200% zoom',
    body: 'All layout measures use dp — no hard-coded font sizes or absolute heights that would clip under OS-level zoom.',
  },
];

const preferences = [
  {
    name: 'reducedMotion',
    description:
      'Collapses every spring-driven transition to an instant change. Wire this to AccessibilityInfo.isReduceMotionEnabled on native and prefers-reduced-motion on web.',
  },
  {
    name: 'reducedTransparency',
    description:
      'Swaps tinted glass for the solid theme background and bumps scrim alpha on GlassSheet / GlassModal.',
  },
  {
    name: 'boldText',
    description:
      'Reserved flag for Phase 3/4 — today primitives honour the platform font-weight scale; the resolver is in place.',
  },
  {
    name: 'highContrast',
    description:
      'Reserved flag for custom personalities that want to swap to a high-contrast palette under Increase Contrast.',
  },
];

export default function AccessibilityPage() {
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
            <h1 className="mt-3 text-4xl font-semibold">Accessibility</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--color-text-secondary)]">
              Absolute UI treats accessibility as a CI contract. Every primitive meets WCAG 2.2 AA
              as a floor and APCA |Lc| ≥ 60 for body text on glass. Every personality is verified
              against the same suite — an a11y regression blocks the merge.
            </p>
          </header>

          <section aria-labelledby="checklist-heading" className="py-4">
            <h2 id="checklist-heading" className="text-2xl font-semibold">
              The a11y checklist
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              Each item below is verified automatically (APCA regression, 44pt layout assertions)
              or manually (VO / TalkBack scripts) before a primitive is considered shipped.
              Missing any item fails the <InlineCode>a11y-auditor</InlineCode> subagent.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {checklist.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-[color:var(--color-divider)] p-5"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-1 inline-block h-2 w-2 rounded-full"
                      style={{ background: 'var(--color-accent)' }}
                    />
                    <div>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="apca-heading" className="py-10">
            <h2 id="apca-heading" className="text-2xl font-semibold">
              APCA contrast on glass
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              WCAG 2.x contrast ratios break down over translucent backdrops because they assume
              a single solid background. The Absolute UI contract is APCA (the Accessible
              Perceptual Contrast Algorithm adopted for WCAG 3). For body text we hold{' '}
              <InlineCode>|Lc| ≥ 60</InlineCode> against the composited backdrop — the glass tint
              painted on top of the theme background.
            </p>
            <CodeBlock
              language="ts"
              caption="packages/a11y/src/apca.ts (consumer API)"
              code={`import { apcaContrast, meetsContrast } from '@absolute-ui/a11y';

// Score: roughly -108 .. +106, positive = dark text on light background
const score = apcaContrast('#F7FAFC', '#0B0F14'); // ≈ 106

// Gate a body-text pairing
if (!meetsContrast({ foreground, background, minLc: 60 })) {
  throw new Error('Text pairing below the APCA floor.');
}`}
            />
            <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
              The <InlineCode>theme-contrast.test.ts</InlineCode> regression suite composites{' '}
              <InlineCode>textPrimary</InlineCode> and <InlineCode>textSecondary</InlineCode>{' '}
              against elevation-1 and elevation-2 recipes for every personality and fails the run
              if any pairing drops below |Lc| ≥ 60.
            </p>
          </section>

          <section aria-labelledby="preferences-heading" className="py-10">
            <h2 id="preferences-heading" className="text-2xl font-semibold">
              Accessibility preferences
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              Primitives never call <InlineCode>AccessibilityInfo</InlineCode> directly. They read
              from <InlineCode>AbsoluteUIContext.preferences</InlineCode> — a platform-agnostic
              shape the consumer wires up at the root. This is what makes tests and stories
              trivially deterministic.
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-[color:var(--color-divider)]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <thead className="bg-[color-mix(in_oklab,var(--color-divider)_60%,transparent)]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Flag</th>
                    <th className="px-4 py-3 font-semibold">Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  {preferences.map((p) => (
                    <tr
                      key={p.name}
                      className="border-t border-[color:var(--color-divider)] align-top"
                    >
                      <td className="px-4 py-3 font-mono text-xs">{p.name}</td>
                      <td className="px-4 py-3 text-[color:var(--color-text-secondary)]">
                        {p.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <CodeBlock
              language="tsx"
              caption="Wiring live preferences on native"
              code={`import { AccessibilityInfo } from 'react-native';
import { AbsoluteUIContext, defaultContextValue } from '@absolute-ui/core';
import { aurora } from '@absolute-ui/tokens';
import { useEffect, useState } from 'react';

export function Provider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState(defaultContextValue.preferences);

  useEffect(() => {
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (reducedMotion) =>
      setPrefs((p) => ({ ...p, reducedMotion })),
    );
    return () => sub.remove();
  }, []);

  return (
    <AbsoluteUIContext.Provider value={{ theme: aurora, preferences: prefs }}>
      {children}
    </AbsoluteUIContext.Provider>
  );
}`}
            />
          </section>

          <section aria-labelledby="testing-heading" className="py-10">
            <h2 id="testing-heading" className="text-2xl font-semibold">
              Manual testing scripts
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
              Every non-trivial primitive ships a <InlineCode>TESTING.md</InlineCode> alongside
              the source covering VoiceOver, TalkBack, Reduced Transparency, and Larger Text
              flows. Run the script before shipping any change that affects focus order, role,
              or visual state.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <InlineCode>
                  packages/core/src/components/GlassCard/TESTING.md
                </InlineCode>{' '}
                — compound header focus order, trailing slot anchor, Reduced Transparency
                fallback.
              </li>
              <li>
                <InlineCode>
                  packages/core/src/components/GlassSheet/TESTING.md
                </InlineCode>{' '}
                — scrim-button escape route, scrim alpha bump, focus-trap gap documentation.
              </li>
              <li>
                <InlineCode>
                  packages/core/src/components/GlassNavBar/TESTING.md
                </InlineCode>{' '}
                — leading / title / trailing focus order, long title truncation contract.
              </li>
            </ul>
          </section>

          <section aria-labelledby="known-heading" className="py-10">
            <h2 id="known-heading" className="text-2xl font-semibold">
              Known gaps (accepted, not hidden)
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[color:var(--color-text-secondary)]">
              <li>
                <strong>Focus trap on GlassSheet / GlassModal.</strong> Phase 1 ships with a
                scrim-button escape route; the real trap + hardware-Escape binding is tracked for
                Phase 2 alongside the motion layer.
              </li>
              <li>
                <strong>Sheet body scroll.</strong> Very large sheet bodies can overflow at the
                Larger Text maximum; Phase 2 wraps the body in a scroll view.
              </li>
              <li>
                <strong>Tab / tablist roles.</strong> The AccessibilityRole shim in this
                repository does not yet cover <InlineCode>tab</InlineCode> and{' '}
                <InlineCode>tablist</InlineCode>; the tab bar currently announces as a list of
                buttons.
              </li>
              <li>
                <strong>Bold Text.</strong> The preference flag is in the public shape but no
                primitive reacts to it yet — gated on the Phase 3 input polish pass.
              </li>
            </ol>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
