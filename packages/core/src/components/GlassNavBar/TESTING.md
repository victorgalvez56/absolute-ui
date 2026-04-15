## GlassNavBar — manual assistive-tech test script

### Setup

- VoiceOver on iOS/macOS, TalkBack on Android
- Story subject: `apps/ladle/src/glass-nav-bar.stories.tsx` "All personalities"

### VoiceOver (iOS / macOS)

1. Open the story. Swipe right from the top-left of the first card.
   - **Expect:** focus lands on the leading action button ("Back, button"). If no leading slot is set, focus skips directly to the title.
2. Swipe right.
   - **Expect:** VO announces `<title>. Heading.` — one focus stop. The outer bar surface must NOT be announced as a group before the heading (verifies `accessibilityRole="none"` on the container).
3. Swipe right.
   - **Expect:** focus lands on the trailing action button ("Edit, button"). If no trailing slot is set, focus skips to the body content below the bar.
4. Double-tap a focused slot button.
   - **Expect:** the press handler fires, the button announcement does not repeat.
5. Rerun steps 1–4 with **Larger Text** at the maximum accessibility size.
   - **Expect:** the bar grows vertically as the title scales, no glyph clipping, slot buttons remain tappable at ≥ 44 × 44.
6. Rerun with **Reduced Transparency**.
   - **Expect:** the glass surface collapses to the theme's opaque background and the title contrast still meets APCA |Lc| ≥ 60 across all four themes (guarded by the `theme-contrast.test.ts` regression suite in `@absolute-ui/a11y` — both elevation 1 and elevation 2 are covered).

### TalkBack (Android)

Mirror the VoiceOver flow. The key invariant is the same three-stop order: leading → title → trailing.

### Sign-off checklist

- [ ] Leading → title → trailing focus order
- [ ] Title announced as heading once, no container announcement above it
- [ ] Slot children reach ≥ 44 × 44 minimum hit target
- [ ] Larger Text does not clip the title
- [ ] Reduced Transparency keeps APCA |Lc| ≥ 60 across all four themes
- [ ] Long titles truncate visually with `numberOfLines={1}` but VO/TalkBack still announce the full untruncated title (Text `children` prop carries the full string)

### Known Phase 2 deferred items

- RNTL render test for the JSX wiring (header role resolution, slot passthrough) — lands with the workspace jsdom setup.
- Maestro E2E flow — lands with the RN CLI example app.
