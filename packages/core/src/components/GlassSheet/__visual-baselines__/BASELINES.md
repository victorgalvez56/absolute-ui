## GlassSheet visual baselines

Phase 2 will commit PNG baselines under this directory. See `GlassSurface/__visual-baselines__/BASELINES.md` for the shared contract.

### Capture URLs

- `http://localhost:61000/?story=primitives--glasssheet--all-personalities&mode=preview`

### What Phase 2 will lock down

- Closed state (sheet trigger visible, no scrim, no sheet body) × 4 personalities
- Open state (trigger visible, scrim applied, handle + title + body + action buttons visible) × 4 personalities — requires a Playwright interaction step to click each "Open sheet" button before capture
- Scrim alpha at both default and Reduced Transparency settings — the Phase 2 capture loop will re-run with `prefers-reduced-transparency: reduce` emulated
- Handle color tracks the theme divider color

### Phase 1 status

Verified in the running Ladle server: the sheet opens on trigger press, the scrim dismisses it, the title and action buttons render correctly in all four themes. No PNG committed yet.
