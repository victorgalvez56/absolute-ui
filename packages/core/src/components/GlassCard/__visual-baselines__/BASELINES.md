## GlassCard visual baselines

Phase 2 will commit PNG baselines under this directory. See `GlassSurface/__visual-baselines__/BASELINES.md` for the shared contract.

### Capture URLs

- `http://localhost:61000/?story=primitives--glasscard--all-personalities&mode=preview`
- `http://localhost:61000/?story=primitives--glasscard--with-trailing&mode=preview`

### What Phase 2 will lock down

- Compound API render: Header / Body / Divider / Footer across four personalities
- Trailing slot alignment (flex-start anchor for multi-line titles)
- Divider inset matches the header/body/footer horizontal padding
- Title + subtitle typography (font scaling safe — no hard lineHeight)

### Phase 1 status

Verified in the running Ladle server: all four themes render, divider is edge-aligned with section content, header/body/footer padding is consistent. No PNG committed yet.
