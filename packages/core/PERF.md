# Render-Perf Regression Gate

Every Glass\* primitive ships with a Reassure idle-render scenario under
`src/components/<Name>/<Name>.perf.tsx`. The harness wraps React Test
Renderer and produces a statistical report over N runs so a single slow
CI machine can't flap the gate.

## Commands

- `pnpm --filter @absolute-ui/core perf` — run the full perf suite
  locally. Prints a table of per-test render durations and fails the
  process if any primitive regresses past the threshold.
- `pnpm --filter @absolute-ui/core perf:baseline` — refresh the
  baseline. Only run this after verifying the new numbers are
  intentional (e.g. you added a feature whose render cost you've
  accepted). On `main`, CI handles this automatically on every push.

## Threshold

The gate fails a PR when any primitive's idle-render duration drifts
more than **±5%** from the baseline recorded on `main`. That mirrors
the per-frame budget we hold the motion layer to — a 5% regression on
a 16.67ms frame is a full millisecond, and a millisecond is enough to
tip a low-end Android device out of the 120Hz tier.

See `reassure.config.js` for the run count (20) and drop-worst setting
(2) used to compute the distribution.
