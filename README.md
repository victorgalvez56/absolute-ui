# Absolute UI

> The liquid glass design system that refuses to drop frames or fail contrast.

**Absolute UI** is an open-source React Native design system built around a distinctive **Liquid Glass** aesthetic, with **performance** and **accessibility** enforced as CI contracts — not marketing claims.

```
⚠️  Status: pre-alpha — planning phase. No code shipped yet.
    Star the repo to follow along.
```

---

## Why another design system?

Scan the landscape and you'll find:

- **Web primitive libraries** (Base UI, Radix, shadcn/ui) — excellent a11y, zero mobile story.
- **React Native libraries** (Paper, NativeBase, gluestack, Tamagui) — strong in one axis (perf *or* DX *or* aesthetics), never all three.
- **Glass-aesthetic projects** — low-level primitives and Figma kits, never a full design system.

**Nobody ships all of this together:**

1. Native **Liquid Glass** (iOS 26 `UIGlassEffect` + tuned Android fallback)
2. **React Native first**, not an afterthought
3. **Performance budgets enforced in CI** (Flashlight + Reassure gates)
4. **Accessibility validated at runtime** (APCA contrast on glass, VoiceOver/TalkBack E2E)

That's the gap. That's what we're building.

---

## Value props

| | |
|---|---|
| 🪟 **Distinctive UI** | Real `UIGlassEffect` on iOS 26, tuned fallback on Android, 4 personality themes — no generic AI aesthetics |
| ⚡ **Performance as a contract** | 120fps budget, <16ms p95 frame time, <50KB per primitive, Reassure + Flashlight gates on every PR |
| ♿ **Accessibility as a contract** | WCAG 2.2 AA + APCA runtime contrast, dynamic type, reduced motion/transparency, VoiceOver + TalkBack E2E |
| 🎨 **Personalities, not just themes** | Aurora · Obsidian · Frost · Sunset — coordinated token + motion + haptic variants |
| 📐 **Pixel-perfect to Figma** | Automated visual regression against the Figma source of truth |
| 🔓 **Forkable by design** | Copy-paste mode *and* npm package mode — own your code if you want to |

---

## Performance budgets

Every PR is blocked if it regresses these:

| Metric | Budget |
|---|---|
| Scroll FPS (mid-range Android) | ≥ 120 |
| Frame time p95 | < 16ms |
| Primitive gzipped size | < 50KB |
| Cold start to interactive | < 1.5s on Pixel 6a |
| Reassure render regression | ±5% |
| Flashlight score drop | ≤ 3 pts PR-over-PR |

---

## Accessibility contract

Every primitive must pass, automatically or it doesn't ship:

- [x] Role + accessible label (with override prop)
- [x] 44×44pt min hit target
- [x] Dynamic Type scales without clipping
- [x] Reduced Transparency → solid fallback
- [x] Reduced Motion → instant transitions
- [x] APCA contrast ≥ Lc 60 on glass surfaces
- [x] Focus ring visible (keyboard + switch control)
- [x] VoiceOver + TalkBack scripts pass
- [x] Zoom 200% layout works
- [x] No color-only state indication

---

## Planned components

**Core** · `GlassSurface` · `GlassCard` · `GlassButton` · `GlassSheet`
**Navigation** · `GlassNavBar` · `GlassTabBar` · `GlassModal` · `GlassToast`
**Inputs** · `GlassInput` · `GlassPicker` · `GlassSwitch` · `GlassSlider`

Each ships across 4 personalities: **Aurora**, **Obsidian**, **Frost**, **Sunset**.

---

## Tech stack

- **React Native** + **Expo SDK 54+** (native Liquid Glass via `expo-glass-effect`)
- **Reanimated 3** + **Gesture Handler** (120fps UI-thread animations)
- **Unistyles 3** (compile-time, tree-shakable)
- **Style Dictionary** (tokens)
- **TypeScript strict** · **Biome**
- **Storybook on-device** + **Ladle** web
- **Next.js 15** docs site on Vercel

Test stack: **Jest + RNTL** · **Maestro** (E2E) · **Reassure** (perf) · **Flashlight** (on-device) · **Chromatic** (visual).

---

## Documentation

This repo is the single source of truth for the project. Start here:

- 📋 **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** — architecture, phases, success criteria
- 🔍 **[RESEARCH.md](./RESEARCH.md)** — competitive analysis, positioning, value props
- ⚙️ **[WORKFLOW.md](./WORKFLOW.md)** — how new components get built, tested, and released
- 📊 **[DIAGRAMS.md](./DIAGRAMS.md)** — visual architecture, workflows, test pyramid, roadmap

---

## Roadmap

- **Phase 0** — Foundation · scaffold, tokens, subagents, hooks, CI
- **Phase 1** — Core primitives · `Surface`, `Button`, `Card`, `Sheet`
- **Phase 2** — Navigation · `NavBar`, `TabBar`, `Modal`, `Toast`
- **Phase 3** — Inputs · `Input`, `Picker`, `Switch`, `Slider`
- **Phase 4** — Launch · 4 personalities polished, docs site, npm publish

Full timeline in [DIAGRAMS.md §7](./DIAGRAMS.md#7-phased-roadmap-gantt).

---

## Contributing

Not accepting PRs yet — the foundation is still being scoped. If you're interested in the direction, **open an issue** with feedback on the research or plan docs. Early adopters who engage now will shape Phase 0.

---

## License

MIT — free for commercial use, no strings attached. (Final license decision in [RESEARCH.md §9](./RESEARCH.md#9-open-questions).)

---

## Author

Built by [Victor Galvez](https://victorgalvez.dev).
