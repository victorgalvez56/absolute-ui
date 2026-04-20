# Pending work — Absolute UI

> Snapshot at commit `a9378df` (branch `claude/identify-missing-features-lfpwo`,
> merged to `main`). Update this file as items close.

## Status of the design system

- **Build / typecheck / lint / tests**: all green. 401 tests pass.
- **Variants/slots pattern shipped on**: `GlassButton`, `GlassCard`, `GlassInput`.
- **Layout primitives shipped**: `Box`, `HStack`, `VStack`.
- **Glass depth**: `GlassSurface` now paints a multi-layer `boxShadow`
  (specular highlight + bottom refraction + elevation drop shadow).

The plan is the rest of the primitives copy the same recipe so the
system feels uniform end-to-end.

---

## 1. Replicate variants/slots in the remaining 9 primitives

Apply the same pattern that `GlassButton` / `GlassCard` / `GlassInput`
already use:

1. Add a `variant` enum in `style.ts` (visual treatments for that primitive).
2. Add an `action` enum where it makes sense (`primary` / `neutral` / `danger`).
3. Add a `size` enum (`sm` / `md` / `lg`) — preserve the 44pt hit-target floor.
4. Pure helpers: `resolve<X>Size`, `resolve<X>Colors`. No `react-native` imports.
5. Slot context with `createContext` for compound sub-components.
6. Tests at the helper level, JSX wiring deferred to Ladle interaction tests.

Order of attack (cheapest → richest):

| Primitive   | Notes                                                              |
| ----------- | ------------------------------------------------------------------ |
| `Switch`    | size only; no real variant axis. Quick win.                        |
| `Slider`    | size + track variant (filled/outline).                             |
| `Picker`    | size + variant (filled/outline/ghost), trigger slot.               |
| `Sheet`     | size (height presets) + variant (filled/outline). **Focus trap still missing.** |
| `Modal`     | size + variant (filled/soft/outline). Same focus-trap debt as Sheet. |
| `Toast`     | variant (`info` / `success` / `warning` / `danger`) + leadingIcon slot. |
| `NavBar`    | variant (filled/transparent), size, leading/trailing slots.        |
| `TabBar`    | variant (filled/outline), size, item slot.                         |
| `Surface`   | already a primitive — only needs the `variant` (filled/soft/outline) overlay so callers can drop the manual border. |

After each one: add a Ladle story matching the existing `Variant matrix` /
`Sizes` / `Slots` pattern under `apps/ladle/src/`.

---

## 2. Visual baselines + a11y testing scripts

| Primitive   | `__visual-baselines__/` | `TESTING.md` |
| ----------- | ----------------------- | ------------ |
| Surface     | yes                     | no           |
| Button      | yes                     | no           |
| Card        | yes                     | yes          |
| Sheet       | yes                     | yes          |
| NavBar      | no                      | yes          |
| Input       | no                      | no           |
| Modal       | no                      | no           |
| Picker      | no                      | no           |
| Slider      | no                      | no           |
| Switch      | no                      | no           |
| TabBar      | no                      | no           |
| Toast       | no                      | no           |

Every cell that says `no` is a deliverable. The visual-baselines folder
needs a Playwright snapshot per personality; `TESTING.md` is the manual
VoiceOver / TalkBack script.

---

## 3. Phase 2 layers not yet wired

- **Motion layer**: Reanimated 3 + Gesture Handler. Today press feedback
  is an instant opacity swap and `GlassSheet` mounts without a slide
  transition. Read `theme.motion.{surface,press,overlay}` and project
  through worklets. Reduced-Motion users keep the instant path.
- **Real focus trap on `GlassSheet` / `GlassModal`**. Today both ship
  a scrim-button escape; replace with a focusable-element trap +
  hardware-Escape binding.
- **Native `UIGlassEffect` (iOS 26)**. Today everything renders via
  `react-native-web` — the pnpm override redirects `react-native` to
  RN-web. The native module is deferred until the example app boots.

---

## 4. Auto-enforcement (`.claude/settings.json` does not exist yet)

Wire the plan §7 hooks via the `update-config` skill:

- On `Edit` / `Write` in `packages/core/src/components/**` →
  run a11y linter + `tsc --noEmit` on changed files.
- On `Stop` if component files changed → `pnpm reassure`
  (perf regression).
- On PR branch push → build code-review graph + `review-delta`.

---

## 5. Phase 4 — launch

- Polish the four personalities (Aurora / Obsidian / Frost / Sunset)
  to a release-ready level. Right now they share recipes; tuning
  per-personality blur / saturation / motion identities is open.
- Docs site (`apps/docs`) — Next.js 15 scaffold exists but no
  content.
- Public Flashlight benchmark report.
- `npm publish` via semantic-release. The packages are already
  set up with proper `exports` / `types`; need a release pipeline.

---

## 6. Pre-existing one-offs left in the repo

- `apps/example/.storybook/storybook.requires.ts` is auto-generated
  by Storybook; biome ignores it now (see `biome.json`).
- `apps/ladle/public/mockServiceWorker.js` is the MSW worker; ignored
  in biome and committed once via `pnpm --filter @absolute-ui/ladle mocks:init`.

---

## How to pick up from here on a fresh checkout

```sh
pnpm install
pnpm -r --filter='./packages/*' run build   # generate dist/ for tokens / a11y / core
pnpm test                                    # 401 tests, all green
pnpm typecheck
pnpm lint
pnpm --filter @absolute-ui/ladle dev         # localhost:61000
```

The reference stories for the new pattern live at:

- `apps/ladle/src/glass-button.stories.tsx` (`Variant matrix`, `Sizes`,
  `Slots and loading`)
- `apps/ladle/src/glass-card.stories.tsx` (`Variant matrix`, `Sizes`)
- `apps/ladle/src/glass-input.stories.tsx` (`Sizes and icons`)
- `apps/ladle/src/layout.stories.tsx` (`Stacks`, `Box spacing`)

Use any of those as a template when adding a new primitive.
