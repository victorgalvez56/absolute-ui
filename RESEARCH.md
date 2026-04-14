# Absolute UI — Competitive Research & Positioning

Goal: ship an **open-source** mobile design system that stands out on **UI distinctiveness**, **performance**, and **accessibility**. This document maps the landscape, identifies gaps, and defines our wedge.

---

## 1. TL;DR — Where we win

Nobody in the open-source space currently ships **all four** of these together:

1. **Native Liquid Glass** aesthetic (iOS 26 `UIGlassEffect` with tuned Android fallback)
2. **React Native first** (not web-first with RN as an afterthought)
3. **Performance budgets enforced in CI** (Flashlight + Reassure gates, not just claims)
4. **Accessibility validated by runtime checks** (APCA contrast on glass, VO/TalkBack E2E via Maestro)

Most competitors own 1–2 of these. Our wedge: **be the only RN design system that treats perf and a11y as CI-enforced contracts, with a distinctive glass aesthetic that doesn't look AI-generated.**

---

## 2. Competitor matrix

Legend: ✅ strong · 🟡 partial · ❌ absent/weak

### 2.1 Web-first headless / primitive libraries

| Project | Platform | Styling | A11y | Perf focus | Distinctive look | License | Wedge vs. us |
|---|---|---|---|---|---|---|---|
| **Base UI** (base-ui.com) | Web | Bring-your-own | ✅ WCAG 2.2, ARIA APG | 🟡 (not a claim) | ❌ Unstyled by design | MIT | Web-only, unstyled — different market |
| **Radix UI / Radix Themes** | Web | CSS vars / unstyled | ✅ Excellent | 🟡 | 🟡 Themes are tasteful but generic | MIT | Web-only, no mobile story |
| **shadcn/ui** | Web | Tailwind | ✅ (via Radix) | 🟡 | 🟡 Copy-paste neutral | MIT | Not a library; web-only |
| **Ark UI** (Chakra) | Web + Solid/Vue | Bring-your-own | ✅ | 🟡 | ❌ Headless | MIT | Multi-framework web, no RN |
| **HeroUI** (ex-NextUI) | Web | Tailwind | ✅ | 🟡 | ✅ Opinionated, modern | MIT | No RN, no glass focus |
| **Mantine** | Web | CSS-in-JS | ✅ | 🟡 | 🟡 Clean but generic | MIT | Web only |
| **Park UI** | Web | Panda/Tailwind | ✅ (Ark) | 🟡 | 🟡 | MIT | Web only |

**Takeaway:** The web primitive space is saturated and mature. Competing there is a losing move. None of these address mobile natively.

### 2.2 React Native component libraries

| Project | Styling | A11y | Perf focus | Distinctive look | Maintenance | Wedge vs. us |
|---|---|---|---|---|---|---|
| **React Native Paper** | Theming | 🟡 | 🟡 | ❌ Material clone | ✅ Active | Material look, no glass |
| **NativeBase** | Utility | 🟡 | ❌ (perf complaints) | 🟡 | 🟡 Slowing | Known perf issues |
| **gluestack-ui** (NativeBase successor) | Tailwind-like | 🟡 | ✅ Copy-paste, small | 🟡 Neutral | ✅ Active | Closest rival — but neutral aesthetic, no enforced perf/a11y gates |
| **Tamagui** | Compile-time | 🟡 | ✅ Best-in-class RN perf | 🟡 Opinionated but generic | ✅ Active | **Strong perf** but styling system, not a glass-aesthetic DS |
| **React Native Reusables** | NativeWind | 🟡 (Radix-inspired) | 🟡 | 🟡 shadcn clone for RN | ✅ Growing | Shadcn clone; neutral look |
| **UI Kitten** | Eva DS | 🟡 | 🟡 | 🟡 Custom theme | 🟡 | No glass, older |
| **Shopify Restyle** | Theme primitives | ❌ (not a component lib) | ✅ | ❌ | ✅ | Infra, not components |
| **Expo UI** (new) | Native | ✅ | ✅ | ✅ (SwiftUI/Jetpack) | ✅ Official | **Biggest threat long-term** — but platform-specific widgets, not a cross-platform DS with personalities |

**Takeaway:** Tamagui owns perf. gluestack owns copy-paste DX. Expo UI owns native fidelity. **Nobody owns distinctive aesthetic + enforced a11y/perf together.**

### 2.3 Glass-aesthetic projects (direct aesthetic competitors)

| Project | What it is | Gap |
|---|---|---|
| **Apple SwiftUI Liquid Glass (iOS 26)** | Native API | iOS-only, no cross-platform, no personalities |
| **@callstack/liquid-glass** (community) | RN wrapper around `UIGlassEffect` | Primitive wrapper, not a full DS |
| **expo-blur / expo-glass-effect** | Low-level blur | Building block, not a DS |
| **Glassmorphism CSS kits** (web) | Static CSS | Web-only, no accessibility contracts |
| **Various Figma liquid-glass kits** | Design files | Not code |

**Takeaway:** The glass aesthetic exists as **primitives and design files**, never as a **full cross-platform DS with a11y/perf guarantees**. This is our opening.

---

## 3. What each competitor does best (and what we steal)

- **Base UI / Radix** — accessibility rigor and composable primitive APIs → we adopt their compound-component patterns and ARIA APG discipline.
- **Tamagui** — compile-time styling, worklet-driven animations → we adopt Unistyles 3 (or Tamagui itself) for the same perf profile.
- **gluestack-ui** — copy-paste ergonomics, small surface → we offer optional copy-paste mode alongside the npm package.
- **shadcn/ui** — owning-your-code philosophy → components are forkable, not locked black boxes.
- **Expo UI** — native-first mindset → we use real `UIGlassEffect` on iOS 26, not a CSS approximation.
- **Shopify Restyle** — type-safe theme primitives → our token layer follows this pattern.

---

## 4. Gaps in the market (our opportunities)

1. **No RN DS enforces performance in CI.** Tamagui is fast, but "fast" is a property, not a gate. We ship Reassure + Flashlight regression gates out of the box — consumers of our library can adopt the same gates.
2. **No RN DS enforces runtime a11y on glass surfaces.** Glass = variable backdrop = contrast hazard. We ship an **APCA runtime contrast checker** that auto-swaps text to a solid backdrop when Lc drops below threshold. Nobody does this.
3. **No RN DS ships "personalities" as a first-class concept.** Theming exists everywhere; *personalities* (coordinated token + motion + sound + haptics variants) do not. Aurora/Obsidian/Frost/Sunset become a brandable axis.
4. **No RN DS ships a pixel-perfect Figma diff agent.** Chromatic exists for web; mobile visual regression is manual. Our `pixel-perfect` agent closes this loop via the Figma MCP.
5. **No RN DS targets 120Hz explicitly.** Most target 60fps. We budget for 120Hz ProMotion + Android high-refresh panels.
6. **Expo UI will eat the "native widgets" niche.** We don't compete there — we complement it by offering the **brandable, cross-platform, personality-driven layer** that sits on top of (or alongside) native widgets.

---

## 5. Positioning statement

> **Absolute UI** is the open-source React Native design system for teams who want a distinctive liquid-glass aesthetic without compromising on performance or accessibility. Every component is gated by 120fps perf budgets and WCAG 2.2 + APCA contrast checks in CI. Pick a personality, ship a brand.

**One-liner:** *The liquid glass design system that refuses to drop frames or fail contrast.*

---

## 6. Value props (ranked)

1. **Distinctive UI** — real `UIGlassEffect` on iOS 26, tuned blur+specular fallback on Android, 4 personality themes, frontend-design-grade visuals that don't look AI-generated.
2. **Performance as a contract** — Reassure + Flashlight CI gates, 120fps budget, <16ms p95 frame time, <50KB per primitive, bundle-size diffs per PR.
3. **Accessibility as a contract** — WCAG 2.2 AA + APCA runtime contrast, VO/TalkBack E2E via Maestro, dynamic type, reduced transparency/motion, 44pt targets — validated, not claimed.
4. **Forkable by design** — copy-paste mode (shadcn-style) *and* npm package mode. Own your code if you want to.
5. **Pixel-perfect to Figma** — automated visual regression against Figma source of truth via the Figma MCP pixel-perfect agent.
6. **Personalities, not just themes** — coordinated token + motion + haptic variants as a product axis brands can exploit.

---

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Expo UI absorbs the space** | Position as the cross-platform brandable layer; interoperate, don't compete |
| **Liquid glass trend fatigue** | Personalities decouple aesthetic from a single trend; tokens allow pivots |
| **Tamagui already owns perf** | We can *build on Tamagui/Unistyles*; perf is a floor, a11y + aesthetic are our walls |
| **Maintaining cross-platform glass parity** | Start iOS-only for Phase 1, land Android fidelity in Phase 2 with explicit parity tests |
| **Open-source sustainability** | Keep scope tight (14 primitives), clear governance, no enterprise SLA promises early |
| **Accessibility claims are easy to make, hard to keep** | Every a11y claim is backed by a runnable CI check — no marketing a11y |

---

## 8. Launch narrative

- **Phase 0–2:** build in public, weekly Flashlight benchmark posts, invite 5 early adopters.
- **Phase 3:** public beta + docs site + comparison benchmarks vs. Paper/gluestack/Tamagui.
- **Phase 4:** 1.0 launch with a blog post: *"We built a liquid glass design system that can't ship a frame drop or a contrast failure"* + public Flashlight scoreboard + open invitation to contribute personalities.

Distribution channels: X, HN (Show HN), r/reactnative, React Native Radio, Expo newsletter, Bytes, This Week in React.

---

## 9. Open questions

1. Build on top of **Tamagui** (inherit perf, cede some control) or **Unistyles 3** (lighter, newer, more control)?
2. Ship as **Expo module** (native glass on iOS 26) or **pure JS** (wider compatibility, weaker glass)?
3. **License** — MIT (standard) or Apache 2.0 (patent grant, better for corporate adoption)?
4. **Governance** — BDFL, small core team, or foundation-style from day one?
5. **Monetization path** (optional) — paid Figma kit? Pro personalities? Enterprise a11y audits? Or pure OSS with sponsorships?
