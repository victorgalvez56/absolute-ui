# Absolute UI — Development Workflow

How skills, subagents, hooks, and tooling interact across the three core flows:

1. **Developing a new component**
2. **Testing**
3. **Publishing a release**

This document is the operating manual. If a step isn't here, it isn't part of the workflow.

---

## 0. Roles at a glance

| Actor | Type | Trigger | Purpose |
|---|---|---|---|
| `perf-auditor` | Subagent | Manual + PR hook | Flashlight, Reassure, bundle-size |
| `a11y-auditor` | Subagent | Edit/Write hook | axe, APCA, jsx-a11y, VO/TalkBack scripts |
| `pixel-perfect` | Subagent | PR hook | Figma MCP → Storybook diff |
| `test-automator` | Subagent | Manual | Generate/maintain Jest + Maestro |
| `Explore` | Built-in | Manual | Codebase research |
| `Plan` | Built-in | Manual | Step-by-step design for non-trivial work |
| `code-review-graph:review-delta` | Skill | Per-commit | Impact-aware review |
| `code-review-graph:review-pr` | Skill | Per-PR | Full structural review |
| `frontend-design` | Skill | Per-component | Distinctive visuals |
| `vercel-react-native-skills` | Skill | Per-component | RN perf patterns |
| `vercel-composition-patterns` | Skill | Per-component | Compound API design |
| `simplify` | Skill | Pre-merge | Final cleanup pass |
| `web-design-guidelines` | Skill | Docs site | UI review |
| `deploy-to-vercel` | Skill | Release | Docs site deploy |
| `add-to-portfolio` / `add-to-obsidian` | Skill | Release | Ship tracking |
| Hooks (`settings.json`) | Harness | Auto | Enforce checks without asking Claude |

---

## 1. Flow A — Developing a new component

### Stage 1 — Kickoff
**Goal:** turn a component idea into an agreed plan before writing code.

1. Open an issue: `feat(GlassX): <description>` with Figma link + a11y requirements.
2. Run **`Plan`** agent with: component spec, Figma node ID, accessibility targets, perf budget.
3. Run **`Explore`** agent to check for similar primitives already in the repo (avoid duplication).
4. Output: `docs/components/<name>/PLAN.md` with API, states, variants, a11y contract, perf budget.

### Stage 2 — Design extraction
**Goal:** pull the source-of-truth design from Figma.

1. Use **Figma MCP** (`get_design_context`, `get_variable_defs`, `get_screenshot`) on the component node.
2. Map Figma variables → Style Dictionary tokens (reuse existing tokens; only add new ones if justified).
3. Save the Figma screenshot to `docs/components/<name>/reference.png` — this becomes the pixel-perfect baseline.

### Stage 3 — Implementation
**Goal:** write the component, guided by the right skills.

1. Invoke **`frontend-design`** skill for the visual pass — distinctive, non-generic.
2. Invoke **`vercel-composition-patterns`** skill to define the compound API (`Glass.X.Header`, etc.).
3. Invoke **`vercel-react-native-skills`** skill for RN perf patterns (worklets, native driver, memoization).
4. Write `src/components/<Name>/<Name>.tsx` + `<Name>.types.ts` + `<Name>.styles.ts` + `index.ts`.
5. **Hooks fire automatically on every save:**
   - `jsx-a11y` lint
   - `tsc --noEmit` on changed files
   - `a11y-auditor` subagent runs APCA + role/label checks
   - Blocks the edit if any check fails hard

### Stage 4 — Stories & docs
1. Write Storybook stories covering: all variants, all personalities, edge cases (long text, dynamic type XL, reduced motion, reduced transparency, RTL).
2. Write MDX docs in `docs/components/<name>/index.mdx` (API, examples, a11y notes, perf notes).

### Stage 5 — Tests (see Flow B)
Author unit, integration, visual, E2E, a11y, perf tests before PR.

### Stage 6 — Review
1. Push branch → hook runs **`code-review-graph:review-delta`** automatically.
2. Open PR → runs in CI:
   - **`perf-auditor`** (Flashlight + Reassure vs. main baseline)
   - **`pixel-perfect`** (Figma diff vs. reference.png, must be <0.1%)
   - **`a11y-auditor`** deep audit (runtime + manual VO script)
   - **`code-review-graph:review-pr`** (blast-radius + structural)
3. Invoke **`simplify`** skill on the diff for final cleanup pass.
4. Human review → merge.

### Stage 7 — Post-merge
- Baselines for Flashlight/Reassure/Chromatic are updated on main.
- Component registered in the public registry (`src/index.ts`).
- Changeset added (`.changeset/`) for semantic-release.

---

## 2. Flow B — Testing

Tests run in **five layers**. Each layer has an owner and a CI gate.

### Layer 1 — Static (pre-commit, <5s)
- **Tools:** Biome, TypeScript strict, `eslint-plugin-jsx-a11y`, `react-native-a11y-linter`.
- **Owner:** hooks.
- **Gate:** commit blocked if anything fails.

### Layer 2 — Unit / integration (CI, <60s)
- **Tools:** Jest + React Native Testing Library + MSW.
- **Owner:** **`test-automator`** subagent generates the initial test file; humans refine.
- **Covers:** API surface, state transitions, prop validation, a11y queries (`getByRole`, `getByLabelText`), compound-component wiring.
- **Gate:** 100% pass, coverage ≥85% for new components.

### Layer 3 — Visual regression (CI, ~2min)
- **Tools:** Chromatic *or* Storybook test-runner + Playwright + pixelmatch.
- **Owner:** **`pixel-perfect`** subagent.
- **Covers:** every story × every personality × light/dark. Diff against Figma `reference.png`.
- **Gate:** <0.1% pixel delta, or an explicit approval in the PR.

### Layer 4 — Perf regression (CI, ~3min)
- **Tools:** Reassure (render-perf), Flashlight (on-device FPS/CPU/mem via EAS Build + real device or firebase test lab).
- **Owner:** **`perf-auditor`** subagent.
- **Covers:** render count, render duration, 120fps scroll test, bundle size.
- **Gate:** ±5% Reassure, Flashlight score drop ≤3 points, bundle ≤50KB per primitive.

### Layer 5 — E2E (CI nightly + pre-release, ~10min)
- **Tools:** **Maestro** (primary), Detox (fallback for gesture-heavy).
- **Owner:** **`test-automator`** subagent.
- **Covers:** navigation flows per personality, form submission, modal/sheet lifecycle, VoiceOver + TalkBack scripted walkthroughs.
- **Gate:** all flows pass on iOS + Android matrix.

### Manual a11y spot check (pre-release)
- VoiceOver on real iPhone
- TalkBack on real Android
- Switch Control + keyboard navigation
- Dynamic Type XXXL
- Reduced Transparency + Reduced Motion toggles
- Screen zoom 200%

Checklist lives at `docs/a11y/manual-checklist.md`; **`a11y-auditor`** generates the per-component script.

---

## 3. Flow C — Publishing a release

### Stage 1 — Release candidate
1. Merge all target PRs to `main`.
2. Run full nightly: perf + visual + E2E on iOS + Android matrix.
3. Invoke **`code-review-graph:review-pr`** on the full diff since last tag.

### Stage 2 — Release notes
1. Changesets aggregate per-PR entries.
2. Invoke **`claude-api`** skill (optional) to draft the human-readable release post from changesets.
3. Run **`simplify`** pass on the release notes.

### Stage 3 — Version bump
1. `pnpm changeset version` → updates package versions semver-correctly.
2. `pnpm install` → lockfile updated.
3. Commit: `chore(release): vX.Y.Z`.

### Stage 4 — Build & publish
1. `pnpm build` — rollup/tsup build for npm, Style Dictionary export for tokens, Expo module build if native code changed.
2. Verify tarball size and contents (`npm pack --dry-run`).
3. `pnpm changeset publish` → npm publish with provenance.
4. Git tag + push.

### Stage 5 — Docs site
1. Invoke **`vercel-react-best-practices`** skill to sanity-check any docs site changes.
2. Invoke **`web-design-guidelines`** skill for a final a11y pass on the docs.
3. Invoke **`deploy-to-vercel`** skill (or `vercel-cli-with-tokens` for CI) to deploy the new docs site.
4. Verify Lighthouse ≥95 across all categories.

### Stage 6 — Announce
1. Invoke **`social-post-generator`** skill → drafts for X, LinkedIn, Instagram.
2. Post release notes to GitHub Releases (auto from changeset action).
3. Publish blog post on docs site.
4. Invoke **`add-to-portfolio`** skill → victorgalvez.dev/ships.
5. Invoke **`add-to-obsidian`** skill → ship note in the vault.

### Stage 7 — Post-release
1. Monitor npm downloads + GitHub issues for 48h.
2. If a regression is reported, roll forward with a patch release (never amend published tags).
3. Update Flashlight public scoreboard on the docs site.

---

## 4. Branch & commit conventions

- Branches: `feat/<name>`, `fix/<name>`, `perf/<name>`, `a11y/<name>`, `docs/<name>`.
- Commits: Conventional Commits (`feat(GlassCard): ...`). Enforced by commit-msg hook.
- PR title: same format as commit; required for changeset generation.
- Never amend published commits. Never force-push to `main`.

---

## 5. CI pipeline (summary)

```
 push / PR
    │
    ├─ static (biome, tsc, a11y-lint)                     [blocker]
    ├─ unit + integration (jest)                          [blocker]
    ├─ visual regression (chromatic / playwright)         [blocker]
    ├─ perf regression (reassure)                         [blocker]
    ├─ perf on-device (flashlight, EAS)                   [blocker]
    ├─ code-review-graph:review-delta                     [advisory]
    ├─ bundle-size diff                                   [blocker]
    └─ e2e (maestro, nightly)                             [blocker on release]
```

All blockers must be green before merge. Advisory steps post comments only.

---

## 6. "I want to add component X" — the short version

1. Open issue with Figma link.
2. Run `Plan` + `Explore`.
3. Pull design via Figma MCP.
4. Write code (hooks enforce a11y + types on save).
5. Write Storybook stories + MDX docs.
6. Ask `test-automator` to scaffold tests; refine.
7. Push branch → review-delta runs.
8. Open PR → perf + pixel-perfect + a11y + review-pr all run.
9. Run `simplify` on the final diff.
10. Merge → changeset → next release.

If any step is skipped, the component doesn't ship. No exceptions for "small" changes — the whole point is that the quality bar is automated, not negotiated.
