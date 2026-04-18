# @absolute-ui/visual

Visual regression pipeline for every story in `apps/ladle/`. Uses
[Playwright](https://playwright.dev) to screenshot each Ladle story at
a locked 1280x900 @ 1x viewport and compare against a baseline image
checked into the repo. If any run diffs by more than **0.1%** of pixels
(`maxDiffPixelRatio: 0.001`), the test fails.

---

## How it works

1. `apps/ladle/build/meta.json` is produced by `ladle build`.
2. `scripts/enumerate-stories.ts` reads that file and emits a list of
   `{ id, url }` pairs, one per story.
3. `tests/stories.spec.ts` loops those entries inside a
   `test.describe.parallel(...)` and calls `toHaveScreenshot()` against
   `http://localhost:4175/?story=<id>&mode=preview`.
4. Playwright's `webServer` block boots `ladle preview` on port 4175
   automatically — you do NOT need to start it yourself.
5. Baselines live at `tests/stories.spec.ts-snapshots/*.png` and are
   committed to git. CI diffs PRs against those baselines.

---

## Prerequisites

```bash
# from repo root
pnpm install
pnpm --dir apps/visual exec playwright install chromium
pnpm --dir apps/ladle build        # produces apps/ladle/build/meta.json
```

> You must rebuild Ladle any time you add or rename a story — otherwise
> `meta.json` is stale and the visual suite won't see your changes.

---

## Local workflows

### Run the diff (fails on drift)

```bash
pnpm --dir apps/visual test
```

On the very first run (no baseline yet), Playwright creates the
baselines and marks the tests as passed. Commit them.

### Accept new baselines

When you intentionally change a component's appearance:

```bash
pnpm --dir apps/ladle build
pnpm --dir apps/visual test:update
git add apps/visual/tests/stories.spec.ts-snapshots
git commit -m "test(visual): update baseline for <story>"
```

### Just list the stories

```bash
pnpm --dir apps/visual enumerate
```

Prints a JSON array of `{ id, url }` to stdout.

---

## CI

`.github/workflows/visual.yml` runs on every pull request. A failed run
uploads the full `playwright-report/` directory (with HTML diff viewer)
as a build artifact.

---

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm --dir apps/visual test` | Run the visual regression suite. Fails on drift. |
| `pnpm --dir apps/visual test:update` | Rewrite baselines to match current renders. |
| `pnpm --dir apps/visual enumerate` | Print enumerated stories as JSON. |
