## GlassButton visual baselines

Phase 2 will commit PNG baselines under this directory. See `GlassSurface/__visual-baselines__/BASELINES.md` for the shared contract.

### Capture URLs

- `http://localhost:61000/?story=primitives--glassbutton--all-personalities&mode=preview`
- `http://localhost:61000/?story=primitives--glassbutton--states&mode=preview`

### What Phase 2 will lock down

- Idle / pressed / disabled / focused state matrix × 4 personalities = 16 captures
- Focus ring visibility at the 3px outline contract
- Pill radius default
- 44x44 min hit target (visual — the size is enforced by style.ts tests)

### Phase 1 status

Verified in the running Ladle server. No PNG committed yet.
