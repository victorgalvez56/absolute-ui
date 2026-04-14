# Absolute UI — Implementation Plan

Mobile-first design system with a **Liquid Glass** aesthetic. Built for **performance**, **speed**, and **accessibility** (WCAG 2.2 AA minimum, APCA-aware contrast on glass surfaces).

---

## 1. Vision

A React Native design system that ships distinctive liquid-glass components with multiple "personalities" (theme variants), backed by an automated quality pipeline: every PR is gated by performance, accessibility, pixel-perfect, and end-to-end tests.

**Non-goals:** generic Material/HIG clones, web-first primitives, AI-looking gradients.

---

## 2. Stack

| Layer | Choice | Reason |
|---|---|---|
| Runtime | **React Native + Expo SDK 54+** | iOS 26 exposes native Liquid Glass via `expo-glass-effect`; Expo modules keep Android fallback clean |
| Animation | **Reanimated 3 + Gesture Handler** | 120fps on UI thread, worklet-based |
| Styling | **Unistyles 3** (or Tamagui) | Compile-time, tree-shakable, variants, theme-aware |
| Language | **TypeScript strict** | |
| Lint/format | **Biome** | Single tool, fast |
| Tokens | **Style Dictionary** | JS + CSS vars + Swift/Kotlin export paths |
| Component preview | **Storybook on-device** + **Ladle** web | Fast iteration on both targets |
| Docs site | **Next.js 15** on Vercel | Server components, fast |

---

## 3. Architecture

### 3.1 Layers

1. **Tokens** — colors, elevation, motion curves, typography, glass recipes (tint, blur radius, border specular, noise). Exported through Style Dictionary.
2. **Primitives** — `GlassSurface`, `GlassCard`, `GlassButton`, `GlassSheet`, `GlassTabBar`, `GlassNavBar`, `GlassToast`, `GlassInput`, `GlassPicker`, `GlassModal`, `GlassSwitch`, `GlassSlider`.
3. **Personalities** — theme variants (Aurora, Obsidian, Frost, Sunset) swappable via `ThemeProvider`; each overrides tokens + motion personality (spring stiffness, damping, easing).
4. **Accessibility layer** — baked into every primitive:
   - Dynamic Type scaling
   - Reduced transparency fallback (solid surface)
   - Reduced motion fallback (no spring, instant transitions)
   - Focus ring (keyboard + switch control)
   - 44×44pt min hit targets
   - Auto role/label inference with overrides
   - APCA contrast check on glass → auto-switches text to solid backdrop when contrast fails
5. **Performance layer** — `InteractionManager` gating, `FlashList` for lists, memoized worklets, native-driven animations only, lazy component registry, Hermes-tuned.

### 3.2 Compound component API

```tsx
<Glass.Card variant="aurora" elevation={2}>
  <Glass.Card.Header title="..." />
  <Glass.Card.Body>...</Glass.Card.Body>
  <Glass.Card.Footer>...</Glass.Card.Footer>
</Glass.Card>
```

---

## 4. Subagents (`.claude/agents/`)

Each agent has a narrow tool allowlist and clear invocation rules.

### 4.1 `perf-auditor`
- **Tools:** Bash, Read, Grep, Edit
- **Runs:** Flashlight (FPS/CPU/mem real-device scoring), Reassure (render-perf regression), Hermes sampling profiler, bundle-size diff
- **Flags:** >16ms frames, unnecessary re-renders, worklet misuse, bundle growth
- **Invoked on:** component PRs, manual deep audits

### 4.2 `a11y-auditor`
- **Tools:** Bash, Read, Grep, Edit
- **Runs:** eslint-plugin-jsx-a11y, axe-core (docs), RNTL a11y queries, APCA contrast checker on glass, VoiceOver/TalkBack manual script generator
- **Validates:** contrast, dynamic type, reduced-transparency, reduced-motion, 44pt targets, focus order, role/label correctness
- **Invoked on:** every `Edit`/`Write` in `src/components/**` (via hook)

### 4.3 `pixel-perfect`
- **Tools:** Bash, Read, Figma MCP, Playwright, Edit
- **Runs:** pulls Figma frames via `get_design_context` / `get_screenshot`, diffs against Storybook snapshots using pixelmatch, reports per-component delta %
- **Invoked on:** PRs touching component visuals

### 4.4 `test-automator`
- **Tools:** Bash, Read, Edit, Write
- **Owns:** Jest + RNTL (unit/integration), Maestro (E2E), Storybook interaction tests, MSW (network mocks)
- **Generates:** test files for new primitives, E2E flows per personality theme

---

## 5. Skills

| Skill | Usage |
|---|---|
| `frontend-design` | Generate distinctive glass visuals, avoid generic AI aesthetics |
| `vercel-react-native-skills` | RN perf patterns baked into perf-auditor |
| `vercel-composition-patterns` | Compound component API design |
| `vercel-react-best-practices` | Docs site (Next.js) |
| `web-design-guidelines` | Docs site UI review |
| `simplify` | Final review pass per component batch |
| `code-review-graph:build-graph` | Initialize structural graph |
| `code-review-graph:review-delta` | Per-commit impact-aware review |
| `code-review-graph:review-pr` | Full PR review with blast-radius |
| `update-config` | Install hooks for auto a11y/perf checks |
| `deploy-to-vercel` + `vercel-cli-with-tokens` | Ship docs site |
| `claude.ai Figma MCP` | Source of truth for pixel-perfect + token extraction |
| `claude-api` | Optional: in-docs AI theme generator with prompt caching |
| `ralph-loop` | Optional: continuous perf-watch during optimization sessions |
| `add-to-portfolio` / `add-to-obsidian` | Ship tracking |

---

## 6. Automated testing libraries

| Layer | Library | Notes |
|---|---|---|
| Unit / integration | Jest + React Native Testing Library | a11y queries, fast |
| E2E mobile | **Maestro** | YAML flows, no rebuilds, CI-friendly |
| Visual regression | **Chromatic** *or* self-hosted Storybook + Playwright + pixelmatch | Per-story diffs |
| Perf regression | **Reassure** | Statistical render-perf CI gate |
| Runtime perf | **Flashlight** | Real-device FPS/CPU/memory score |
| A11y static | eslint-plugin-jsx-a11y + react-native-a11y-linter | Catches at edit time |
| A11y runtime | axe-core (docs) + manual VO/TalkBack scripts | Real assistive-tech validation |
| Network mocks | MSW | Shared between tests and Storybook |

---

## 7. Hooks (`settings.json` via `update-config` skill)

- **On `Edit`/`Write` in `src/components/**`** → run a11y linter + `tsc --noEmit` on changed files
- **On `Stop` if component files changed** → run Reassure perf regression
- **On PR branch push** → build graph + run `code-review-graph:review-delta`

These are the only way to get *automatic* enforcement — memory/preferences can't trigger the harness.

---

## 8. Performance budgets

| Metric | Target |
|---|---|
| Scroll FPS (mid-range Android) | 120fps sustained |
| Frame time p95 | <16ms |
| Component gzipped size | <50KB per primitive |
| Cold start to interactive (example app) | <1.5s on Pixel 6a |
| Reassure render-perf regression threshold | ±5% |

Flashlight score must not drop more than 3 points PR-over-PR.

---

## 9. Accessibility checklist (per primitive)

- [ ] Role + accessible label (with prop override)
- [ ] 44×44pt min hit target
- [ ] Dynamic Type scales without clipping
- [ ] Reduced Transparency → solid fallback
- [ ] Reduced Motion → instant transitions
- [ ] APCA contrast ≥ Lc 60 for body text on glass
- [ ] Focus ring visible under keyboard + switch control
- [ ] VoiceOver + TalkBack manual script passes
- [ ] Works with screen zoom 200%
- [ ] No color-only state indication

---

## 10. Phased delivery

### Phase 0 — Foundation
- Scaffold Expo + TS strict + Biome + Unistyles
- Style Dictionary token pipeline + 4 personality themes
- A11y utilities (APCA contrast, reduced-motion/transparency hooks, focus ring)
- Create 4 subagents in `.claude/agents/`
- Install hooks via `update-config`
- Wire Jest + Maestro + Reassure + Flashlight + Chromatic into CI
- Build code-review graph
- Storybook on-device + Ladle web

### Phase 1 — Core primitives
`GlassSurface`, `GlassButton`, `GlassCard`, `GlassSheet`
- Full a11y checklist per component
- Reassure baseline + Flashlight baseline
- Storybook stories + Chromatic snapshots
- Figma pixel-perfect diff

### Phase 2 — Navigation family
`GlassNavBar`, `GlassTabBar`, `GlassModal`, `GlassToast`
- Maestro E2E flows per personality
- Focus order + gesture tests

### Phase 3 — Inputs
`GlassInput`, `GlassPicker`, `GlassSwitch`, `GlassSlider`
- Dynamic Type + keyboard interaction
- Form integration examples

### Phase 4 — Themes + docs + benchmarks
- Polish 4 personality themes (Aurora, Obsidian, Frost, Sunset)
- Docs site on Vercel
- Public Flashlight benchmark report
- npm publish

---

## 11. Open questions (need answers before Phase 0)

1. **Platform scope** — RN iOS+Android only, or also web (RN Web)?
2. **Distribution** — npm package / monorepo / Expo module?
3. **Visual regression** — Chromatic (paid, zero-setup) or self-hosted (free, ~1 day wiring)?
4. **Maestro Cloud vs local-only** — affects CI cost
5. **Existing Figma file** to wire pixel-perfect agent against?
6. **Brand constraints** — any existing tokens, or fully greenfield?

---

## 12. Success criteria

- 14+ primitives shipped across 4 personalities
- 100% of primitives pass the a11y checklist
- Flashlight score ≥ 90 on Pixel 6a
- Zero Reassure regressions on main
- Chromatic diff < 0.1% vs Figma source of truth
- Docs site Lighthouse ≥ 95 across all categories
- Published to npm with semantic-release
