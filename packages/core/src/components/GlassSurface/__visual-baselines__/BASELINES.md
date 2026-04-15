## GlassSurface visual baselines

Phase 2 will commit PNG baselines under this directory. The expected layout is:

```
__visual-baselines__/
  all-personalities.reference.png   # Phase 1 provenance (not yet captured)
  default.aurora.png                # Phase 2 automated baseline
  default.obsidian.png
  default.frost.png
  default.sunset.png
  elevations.aurora.png
```

### Capture contract

- **URL:** `http://localhost:61000/?story=primitives--glasssurface--all-personalities&mode=preview`
- **Viewport:** 1440x900, 2x density
- **Reduced motion:** `prefers-reduced-motion: no-preference`
- **Runner:** Playwright + pixelmatch (to be installed in Phase 2)
- **Delta threshold:** <0.1% against the committed PNG

### Phase 1 status

Verified by hand in the running Ladle dev server that the story renders the four personalities with real browser backdrop-filter blur. No PNG committed yet — the tooling to capture a PNG to disk lands with the Phase 2 pixel-perfect pipeline.
