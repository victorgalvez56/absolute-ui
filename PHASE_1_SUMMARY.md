# Phase 1 Summary — Core primitives

**Status: complete** — four primitives shipped with a11y audits closed, tests green, and Ladle stories rendering in the browser.

## What shipped

| Primitive | Component | Pure helpers | Tests | Story | A11y audit |
|---|---|---|---|---|---|
| `GlassSurface` | [GlassSurface.tsx](packages/core/src/components/GlassSurface/GlassSurface.tsx) | [style.ts](packages/core/src/components/GlassSurface/style.ts) | 4 | ✅ | closed |
| `GlassButton` | [GlassButton.tsx](packages/core/src/components/GlassButton/GlassButton.tsx) | [style.ts](packages/core/src/components/GlassButton/style.ts) | 20 | ✅ | closed |
| `GlassCard` (compound) | [GlassCard.tsx](packages/core/src/components/GlassCard/GlassCard.tsx) | [style.ts](packages/core/src/components/GlassCard/style.ts) | 22 | ✅ | closed |
| `GlassSheet` | [GlassSheet.tsx](packages/core/src/components/GlassSheet/GlassSheet.tsx) | [style.ts](packages/core/src/components/GlassSheet/style.ts) | 23 | ✅ | closed |

Shared infrastructure:

- **`AbsoluteUIContext`** ([theme-context.ts](packages/core/src/theme-context.ts)) — runtime injection point for theme + accessibility preferences. Every primitive reads from this context, not from `AccessibilityInfo` directly, so tests and stories can inject preferences without platform shims.
- **`@absolute-ui/a11y`** — APCA contrast, reduced-motion / reduced-transparency resolvers, focus-ring token, and a new `theme-contrast.test.ts` regression guard asserting |Lc| ≥ 60 for both `textPrimary` and `textSecondary` on composited elevation-1 surfaces across all four themes.
- **`types/react-native.d.ts`** — extended to cover `View`, `Text`, `Pressable`, `PressableStateCallbackType`, `AccessibilityRole`, and `AccessibilityState` so the `@absolute-ui/core` primitives typecheck without the real `react-native` package on disk.

## Agents actually used

- **`a11y-auditor`** — invoked on every primitive. Found real issues: focus ring missing on `GlassButton`, Dynamic Type lineHeight clipping on `GlassCard`, missing Reduced Transparency handling on `GlassSheet`, missing TESTING.md on the modal surfaces. Each finding produced a commit that closed the audit.
- **`test-automator`** — generated the test suites for `GlassButton`, `GlassCard`, and `GlassSheet`. Chose the "extract pure helpers" path over installing jsdom, matching the `GlassSurface` precedent. Landed 65 tests across the three primitives.
- **`pixel-perfect`** — planning-only invocation. Recommended capturing Phase 1 reference PNGs but the environment has no disk-persist screenshot path, so the decision was to seed `BASELINES.md` documenting the capture contract and defer actual automation to Phase 2.
- **`perf-auditor`** — not invoked. Blocked on Flashlight / Reassure / RN CLI example app, all Phase 2 work.

## Test counts

- **89 tests passing** across 7 files (`pnpm test`)
- Typecheck clean across `tokens`, `a11y`, `core`, `apps/ladle`
- Lint clean (Biome)

## Accessibility artifacts per primitive

- APCA contrast verified against composited elevation-1 surfaces for all four themes; guarded by the regression suite in `@absolute-ui/a11y`
- Reduced Transparency fallback wired through `resolveGlassRecipe` on every surface, plus the scrim-alpha bump on `GlassSheet`
- Reduced Motion: no animation in Phase 1, so nothing to gate
- `GlassCard/TESTING.md` and `GlassSheet/TESTING.md` carry the VO / TalkBack scripts for the compound header and the modal focus / escape flows

## Known Phase 2 debt (accepted, not hidden)

1. **Visual regression automation** — Playwright + pixelmatch + the <0.1% delta contract. `BASELINES.md` in each `__visual-baselines__/` directory documents the capture URL, viewport, and reduced-motion settings so the Phase 2 wiring has targets.
2. **RN CLI example app** + `react-native` native side. Everything in Phase 1 runs through `react-native-web` via the pnpm override. The real `UIGlassEffect` native module is Phase 2.
3. **Motion layer** — Reanimated 3 + Gesture Handler wiring. Today press feedback is an instant opacity swap, and `GlassSheet` mounts without a slide transition. Phase 2 wires `theme.motion.overlay` through the surface.
4. **Focus trap** on `GlassSheet`. Phase 1 documents the gap and ships a scrim-button escape route; Phase 2 replaces it with a real trap + hardware-Escape binding.
5. **Reassure / Flashlight** — perf contracts plug in once the RN CLI app is running.
6. **RNTL render tests** for the JSX layer of `GlassButton`, `GlassCard`, `GlassSheet`. Phase 1 covers the pure helpers only.
7. **Maestro E2E flows** — one per primitive per personality, deferred until the app exists.

## Commit graph (Phase 1 only)

Every step was committed separately per the project's cadence rule. From the `GlassButton` start to the Phase 1 closing commit, the branch carries ~25 commits each tied to one logical decision.
