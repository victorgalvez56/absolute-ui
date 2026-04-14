## @absolute-ui/tokens

Design tokens and personality themes for Absolute UI.

Exposes base scales (color, spacing, radius, motion, typography), the `GlassRecipe` type for liquid-glass surface recipes, and four personality themes: **Aurora**, **Obsidian**, **Frost**, **Sunset**.

### Why pure TypeScript (and not Style Dictionary yet)

The plan listed Style Dictionary for multi-platform token export (JS, CSS vars, Swift, Kotlin). Phase 0 only needs JS output, so tokens are defined directly in TypeScript — typed at the source, consumed directly by `@absolute-ui/core`, zero build step.

When we actually need Swift/Kotlin exports (e.g. for a native module or a web docs site that wants CSS vars), we can add Style Dictionary as a codegen layer over these same TS modules without rewriting anything.
