## GlassSheet — manual assistive-tech test script

GlassSheet is a modal primitive with non-trivial focus and escape semantics. Automated tests cover the pure layout helpers; this script covers what only a real screen reader can verify.

### Setup

- iOS device/simulator with **VoiceOver** enabled
- Android device/emulator with **TalkBack** enabled
- Test subject: the `apps/ladle/src/glass-sheet.stories.tsx` "All personalities" story

### Phase 1 known gap — focus trap

Phase 1 ships without a native focus trap. Background content remains reachable by swipe gesture after the sheet opens. Users must rely on the scrim "Dismiss sheet" button to exit. A proper focus trap (and the inert-background treatment) is tracked for Phase 2 alongside the motion layer.

### VoiceOver (iOS / macOS)

1. Open the story, focus the "Open sheet" trigger, double-tap.
   - **Expect:** VO announces the sheet title (e.g. "Share post, heading") as the first focus stop after the sheet mounts. If the sheet has no title, it announces the caller-provided `accessibilityLabel` instead.
2. Swipe right.
   - **Expect:** the body paragraph is read in full.
3. Swipe right.
   - **Expect:** focus lands on the first action button inside the sheet ("Everyone, button"). The sheet container itself must NOT be announced as a group (verifies `accessibilityRole="none"` on the wrapper).
4. Swipe right through the remaining action buttons.
   - **Expect:** each is individually reachable and announces its `accessibilityLabel`.
5. Swipe right past the last action button.
   - **Expect:** focus lands on the scrim's **"Dismiss sheet"** button. This is the explicit VO escape route. Double-tap to close.
6. Repeat with **Reduced Transparency** enabled.
   - **Expect:** the sheet surface is solid (no blur), the scrim alpha bumps up so the modal cue remains strong (dark themes go from `#FFFFFF26` to `#FFFFFF66`, light themes from `#00000066` to `#000000A6`), and all announcements above still work.
7. Repeat with **Larger Text** at maximum.
   - **Expect:** title and body grow proportionally; the sheet grows vertically and may overflow — Phase 2 will wrap the body in a scroll view. For now, verify nothing clips horizontally.

### TalkBack (Android)

Mirror the VoiceOver flow. The key invariants are:
- One focus stop for the title
- Each action button individually reachable
- Scrim reachable as "Dismiss sheet" button after the last action button

### Sign-off checklist

- [ ] Title announced as heading when set
- [ ] `accessibilityLabel` fallback announced when no title
- [ ] Background container not announced as its own group
- [ ] Each action button individually reachable
- [ ] Scrim reachable as "Dismiss sheet" button
- [ ] Double-tapping scrim closes the sheet
- [ ] Reduced Transparency bumps scrim alpha as specified
- [ ] Larger Text does not clip titles or action labels

Phase 2 will replace the scrim-button escape with a proper focus trap plus a hardware-Escape binding on web.
