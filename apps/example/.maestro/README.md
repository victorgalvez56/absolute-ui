# Maestro E2E flows

End-to-end flows for the Absolute UI example app, written against
[Maestro](https://maestro.mobile.dev). Each flow drives the showcase
screen via `accessibilityLabel` matchers, so they stay stable across
theme swaps and copy changes.

## Flows

| File | What it covers |
| --- | --- |
| `smoke.yaml` | Launches the app, asserts the "Absolute UI" title, and walks Components/Themes/About tabs. |
| `theme-cycle.yaml` | Taps the NavBar theme cycler four times and asserts aurora -> obsidian -> frost -> sunset -> aurora. |
| `buttons.yaml` | Taps the Primary, Disabled, and Elevation-2 GlassButton variants. |
| `switches.yaml` | Toggles Wi-Fi off->on and Bluetooth off->on->off. Idempotent. |
| `slider-volume.yaml` | Swipes the Volume slider right and asserts the `%` readout still renders. |
| `picker-density.yaml` | Taps Compact, Comfortable, and restores Cozy in the density picker. |
| `input-email.yaml` | Types `you@example.com` into the Email input, dismisses the keyboard, verifies no error. |
| `modal.yaml` | Opens the Delete-artwork modal twice, dismissing with Cancel then Delete. |
| `sheet.yaml` | Opens the Share sheet and dismisses it via "Copy link". |
| `toast.yaml` | Shows the "Saved" toast and waits for the 2.4s auto-dismiss. |

## Install Maestro

```bash
brew install maestro
```

See [maestro.mobile.dev/getting-started](https://maestro.mobile.dev/getting-started/installing-maestro)
for Linux/Windows install options.

## Run

All flows in order:

```bash
maestro test apps/example/.maestro/
```

Single flow:

```bash
maestro test apps/example/.maestro/smoke.yaml
```

## Prerequisites

Maestro drives whatever app is already installed on the target
device/emulator — it does **not** launch Metro or build the app. Boot
the example app first:

```bash
pnpm --dir apps/example ios
# or
pnpm --dir apps/example android
```

Once the example is running on a simulator/emulator or a physical
device with USB debugging enabled, run `maestro test …` from a
separate shell.

## App IDs

- iOS bundle id: `org.reactjs.native.example.AbsoluteUiExample`
- Android package: `com.absoluteuiexample`

Flows pin the iOS bundle id at the top (`appId:`). Update to the
Android package id when targeting Android only, or run `maestro test`
with the `--app-id` override for one-off swaps.
