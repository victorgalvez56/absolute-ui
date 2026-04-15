## GlassCard — manual assistive-tech test script

Run this script before shipping any change that affects the compound API (`GlassCard`, `GlassCard.Header`, `GlassCard.Body`, `GlassCard.Footer`, `GlassCard.Divider`) or the way those slots compose. Automated unit tests cover the pure layout helpers in `style.ts`; this script covers what only a real screen reader can verify: focus order, announcement wording, and interaction with user preferences.

### Setup

- iOS 16+ device or simulator with **VoiceOver** enabled (Settings → Accessibility → VoiceOver)
- Android 13+ device or emulator with **TalkBack** enabled (Settings → Accessibility → TalkBack)
- Web browser with a screen reader for Ladle smoke-testing: macOS VoiceOver against Chrome, or NVDA against Firefox
- Test subject: the `apps/ladle/src/glass-card.stories.tsx` "All personalities" story

### VoiceOver (iOS / macOS)

1. Open the story; do a single-finger swipe right from the top of the card.
   - **Expect:** one announcement combining title and subtitle — e.g. *"Upgrade available. Absolute UI 0.1.0 ships the new liquid glass primitives. Heading."*
   - **Fail if:** the title and subtitle are announced as two separate focus stops, or the word "Heading" is missing (regression in `accessibilityRole="header"`), or the outer card is announced as a container first ("Group").
2. Swipe right again.
   - **Expect:** the body `Text` content is read in full.
3. Swipe right again.
   - **Expect:** focus lands on the first footer button (e.g. "Dismiss, button"). The outer GlassSurface must NOT be announced — verifies `accessibilityRole="none"` on the root.
4. Swipe right again.
   - **Expect:** focus moves to the second footer button ("Install, button").
5. Double-tap on the focused button.
   - **Expect:** the press handler fires. Button announcement does not repeat.
6. Re-run steps 1–5 with **Reduced Transparency** enabled (Settings → Accessibility → Display → Increase Contrast → Reduce Transparency).
   - **Expect:** every card surface is solid (no blur), text remains at APCA Lc ≥ 60 for all four themes, and the announcement order is unchanged.
7. Re-run with **Larger Text** set to the maximum (Settings → Accessibility → Display → Larger Text).
   - **Expect:** title and subtitle grow proportionally, the card grows vertically, no glyph clipping, the trailing slot (in the "With trailing" story) anchors to the top of the header row and does not overlap the title.

### TalkBack (Android)

1. Open the story and swipe right across the card.
   - **Expect:** single announcement combining title and subtitle followed by "Heading" role. TalkBack's speech verbosity may differ from VoiceOver — the key invariant is that the heading is reachable in one focus stop, not two.
2. Swipe right through body → footer buttons → verify each footer button is individually reachable.
3. Double-tap a footer button to activate.
4. Enable **Remove animations** (Settings → Accessibility → Remove animations) and re-run.
   - **Expect:** no animation changes, layout identical (GlassCard has no motion today, so this is a no-op but protects against future regressions).
5. Switch **Text size** to maximum (Settings → Accessibility → Text and display → Font size).
   - **Expect:** same as iOS step 7.

### Web (Ladle smoke test)

1. Run `pnpm --filter @absolute-ui/ladle dev` and open the GlassCard "All personalities" story.
2. Press `Tab` — verify the focusable elements are the two footer buttons in each card, in reading order.
3. Activate VoiceOver (macOS: `Cmd-F5`) and navigate to one card with `VO-Right`.
4. Verify the same announcement contract as VoiceOver on iOS.

### Sign-off checklist

- [ ] Single heading announcement combining title + subtitle
- [ ] Non-interactive surface not announced as a container
- [ ] Footer buttons individually reachable and activatable
- [ ] Reduced Transparency: solid fallback, contrast preserved
- [ ] Larger Text: no glyph clipping, no layout overlap, trailing slot anchors to top
- [ ] TalkBack mirror passes
- [ ] Web Ladle smoke test passes

If any item fails, file the bug against GlassCard with the failing theme, user preference, and platform, and revert the change that introduced it.
