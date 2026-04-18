# Flashlight — Runtime Performance Benchmarks

[Flashlight](https://github.com/bamlab/flashlight) is the regression gate for runtime performance on Android. It runs a Maestro flow while sampling FPS, CPU, and memory via `adb`, then emits an aggregate **0-100 score**.

- **Target:** `>= 90` on Pixel 6a (see `IMPLEMENTATION_PLAN.md` section 8)
- **PR gate:** new score vs. `main` baseline delta `<= 3` points

> Android only. Flashlight relies on `adb` sampling and the Android Profiler pipeline — there is no iOS equivalent, so iOS perf regressions are covered by Reassure instead.

## Prerequisites

1. Install the CLI (Homebrew):

   ```sh
   brew tap bamlab/tap
   brew install flashlight
   ```

2. Make sure an Android target is reachable from `adb`:
   - an emulator running (API 34, Pixel 6a profile mirrors CI), **or**
   - a physical device connected over USB with developer mode + USB debugging enabled.

   Confirm with:

   ```sh
   adb devices
   ```

3. Install the debug build of the example app (`com.absoluteuiexample`) on that target:

   ```sh
   pnpm --dir apps/example android
   ```

## Run the benchmark

From the repo root:

```sh
flashlight test --config apps/example/.flashlight/showcase.yaml
```

or, equivalently, via the package script:

```sh
pnpm --dir apps/example perf:flashlight
```

Results — including the JSON score file and raw samples — land in `apps/example/.flashlight/results/`. That directory **is checked in for baseline files** (`*baseline*.json`); all other runs are gitignored (see `apps/example/.gitignore`). Do not delete existing baselines by hand; re-record them explicitly (below).

## Re-record the baseline

The baseline is the regression contract: every PR diffs its score against it. Re-record it only on `main` after an intentional performance change (never from a feature branch).

```sh
flashlight test \
  --bundleId com.absoluteuiexample \
  --testCommand "maestro test apps/example/.maestro/smoke.yaml" \
  --resultsTitle "baseline"
```

Flashlight will write `apps/example/.flashlight/results/baseline.json`. Commit it in the same PR that introduces the perf change, with a note explaining why the baseline shifted.

## CI

The `.github/workflows/flashlight.yml` workflow runs this benchmark on a macOS runner with an Android emulator. It is `workflow_dispatch` only for now — spinning up an emulator on every PR is too heavy — so treat local runs as the primary feedback loop and trigger CI manually before merging any perf-sensitive change.
