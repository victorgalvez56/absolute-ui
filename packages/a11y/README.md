## @absolute-ui/a11y

Accessibility utilities for Absolute UI.

### What's inside

- **APCA contrast** (`apcaContrast`, `meetsContrast`) — perceptual contrast calculation for Lc scores on liquid-glass surfaces, where WCAG 2.x ratios break down over translucent backdrops.
- **Accessibility preferences** (`AccessibilityPreferences`) — platform-agnostic type + resolvers for Reduced Motion, Reduced Transparency, Bold Text, and High Contrast. React Native bindings live in `@absolute-ui/core` and call into these resolvers.
- **Glass fallback resolver** (`resolveGlassRecipe`) — swaps a translucent recipe for a solid surface when Reduced Transparency is on.
- **Motion fallback resolver** (`resolveSpring`) — returns an instant spring when Reduced Motion is on.

### APCA note

APCA (Accessible Perceptual Contrast Algorithm) by Andrew Somers is the
measurement framework adopted for WCAG 3. We use the SAPC / G-4g
formulation with no modifications. Output is **Lc** (lightness contrast),
which ranges roughly from -108 (white-on-black extreme) to +106 (black-on-white extreme). For body text, a threshold of **|Lc| ≥ 60** is the Absolute UI contract on glass.
