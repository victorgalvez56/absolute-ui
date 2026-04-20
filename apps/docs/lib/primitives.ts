/**
 * Static metadata for every Absolute UI primitive exposed in the docs.
 * Kept here (not in @absolute-ui/core) because the docs site is the
 * only consumer that needs a flat list indexed by slug for routing,
 * search, and sidebar ordering.
 *
 * Every entry mirrors the real source in packages/core/src/components
 * and the stories in apps/ladle/src. When a primitive ships a new
 * prop, variant, or story, update the matching entry here so the
 * docs, the Ladle preview link, and the sidebar stay in lockstep.
 */

export type PropRow = {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
};

export type ExampleSnippet = {
  title: string;
  description: string;
  code: string;
};

export type VariantRow = {
  name: string;
  description: string;
  storyId?: string;
};

export type PrimitiveDoc = {
  slug: string;
  name: string;
  /** Phase the primitive was introduced in — used for sidebar grouping. */
  phase: 1 | 2 | 3;
  tagline: string;
  /** Long-form overview rendered under the title — 1–3 short paragraphs. */
  overview: string;
  /** Story ID inside the Ladle playground (used for the preview iframe). */
  storyId: string;
  /** Hand-written prop table, or null for a "coming soon" placeholder. */
  props: Array<PropRow> | null;
  /** Props for compound sub-components (GlassCard.Header, etc.). */
  slotProps?: Array<{ name: string; props: PropRow[] }>;
  /** Variants exercised in the matching Ladle story file. */
  variants: Array<VariantRow>;
  /** Copy-pasteable usage examples — kept short. */
  examples: Array<ExampleSnippet>;
  /** A11y contract bullets — mirror the checklist in IMPLEMENTATION_PLAN §9. */
  accessibility: string[];
};

/* ------------------------------------------------------------------ */
/*  Phase 1 — Core primitives                                         */
/* ------------------------------------------------------------------ */

const glassSurface: PrimitiveDoc = {
  slug: 'glass-surface',
  name: 'GlassSurface',
  phase: 1,
  tagline: 'Base liquid-glass primitive every other component composes.',
  overview:
    'GlassSurface is the atom. It resolves the current theme, picks the glass recipe for a given elevation, and composes a tinted, blurred, bordered surface with a noise overlay. When the user has Reduced Transparency enabled it automatically collapses to the theme background so contrast is preserved on every personality.',
  storyId: 'primitives--glasssurface--all-personalities',
  props: [
    {
      name: 'elevation',
      type: '0 | 1 | 2 | 3',
      required: false,
      default: '1',
      description:
        'Selects the glass recipe. Higher elevations add blur, saturation, and a stronger tint — use 0 for inline chips, 2 for nav bars, 3 for modals.',
    },
    {
      name: 'radius',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill'",
      required: false,
      default: "'md'",
      description: 'Corner radius token from @absolute-ui/tokens.',
    },
    {
      name: 'theme',
      type: 'Theme',
      required: false,
      description:
        'Override the theme for this subtree. Defaults to the nearest AbsoluteUIContext.',
    },
    {
      name: 'style',
      type: 'ViewStyle',
      required: false,
      description:
        'Layout style (width / padding / margin). Avoid visual overrides — they defeat the theme contract.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      description: 'Content rendered on top of the glass.',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Aurora, Obsidian, Frost, Sunset side by side at elevation 1.',
      storyId: 'primitives--glasssurface--all-personalities',
    },
    {
      name: 'Elevation ladder',
      description: 'The four elevations on a single theme so recipe differences are obvious.',
      storyId: 'primitives--glasssurface--elevation-ladder',
    },
  ],
  examples: [
    {
      title: 'Basic surface',
      description:
        'A padded elevation-1 surface. The theme provider decides which personality it renders as.',
      code: `import { GlassSurface } from '@absolute-ui/core';

export function Card() {
  return (
    <GlassSurface elevation={1} radius="lg" style={{ padding: 16 }}>
      <Text>Live, breathing glass.</Text>
    </GlassSurface>
  );
}`,
    },
    {
      title: 'Theme override',
      description:
        'Pin a subtree to a specific personality without wrapping the whole tree in a new provider.',
      code: `import { GlassSurface } from '@absolute-ui/core';
import { sunset } from '@absolute-ui/tokens';

<GlassSurface theme={sunset} elevation={2} radius="xl">
  {children}
</GlassSurface>`,
    },
  ],
  accessibility: [
    'Reduced Transparency resolver swaps the tinted glass for a solid theme background on every elevation.',
    'APCA contrast on composited elevation-1 surfaces is regression-tested against |Lc| ≥ 60 for textPrimary and textSecondary across all four themes.',
    'Surface carries no accessibility role by default — consumers add role + label on the content that sits on top.',
  ],
};

const glassButton: PrimitiveDoc = {
  slug: 'glass-button',
  name: 'GlassButton',
  phase: 1,
  tagline: 'Interactive liquid-glass button with 44pt hit target and APCA-safe label.',
  overview:
    'GlassButton is the canonical pressable surface. It composes GlassSurface, enforces the 44×44pt hit target, paints a focus ring under keyboard/switch control, and auto-wraps string children in themed text. Pressed feedback is an instant opacity swap in Phase 1 — the Phase 4 motion layer will replace it with a spring gated on Reduced Motion.',
  storyId: 'primitives--glassbutton--all-personalities',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description:
        'Label or composition of icon + text. Strings are wrapped in a themed Text automatically.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      required: false,
      description:
        'Announced by screen readers. Falls back to the string child when omitted, but always set it explicitly for clarity.',
    },
    {
      name: 'accessibilityHint',
      type: 'string',
      required: false,
      description:
        'Hint describing what happens on press ("opens the share sheet"). Read after the label.',
    },
    {
      name: 'onPress',
      type: '() => void',
      required: false,
      description:
        'Press handler. Omit to make the button decorative — still rendered in the a11y tree as disabled.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Suppress interactivity and dim the surface. Announced as disabled.',
    },
    {
      name: 'elevation',
      type: '0 | 1 | 2 | 3',
      required: false,
      default: '1',
      description: 'Forwarded to the underlying GlassSurface.',
    },
    {
      name: 'radius',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill'",
      required: false,
      default: "'pill'",
      description: 'Corner radius. Pill is the classic liquid-glass capsule.',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Enabled button rendered across the four themes.',
      storyId: 'primitives--glassbutton--all-personalities',
    },
    {
      name: 'States',
      description: 'Idle, focused, pressed, disabled, and decorative (no handler) side by side.',
      storyId: 'primitives--glassbutton--states',
    },
  ],
  examples: [
    {
      title: 'Primary action',
      description: 'The simplest use — label and handler.',
      code: `<GlassButton
  accessibilityLabel="Save draft"
  onPress={saveDraft}
>
  Save
</GlassButton>`,
    },
    {
      title: 'Icon + label',
      description:
        'Compose an icon with a themed Text child. The whole composition stays inside the pill.',
      code: `<GlassButton
  accessibilityLabel="Share post"
  accessibilityHint="Opens the share sheet"
  onPress={share}
>
  <ShareIcon />
  <Text>Share</Text>
</GlassButton>`,
    },
  ],
  accessibility: [
    '44×44pt minimum hit target enforced by style.ts regardless of label length.',
    'Focus ring renders from Pressable.focused with a 2px outline in theme.colors.focusRing.',
    'Disabled state announces with accessibilityState.disabled = true and suppresses the focus ring.',
    'Omitting onPress renders the button as decorative — it still appears in the a11y tree, but disabled.',
  ],
};

const glassCard: PrimitiveDoc = {
  slug: 'glass-card',
  name: 'GlassCard',
  phase: 1,
  tagline: 'Compound content container with Header / Body / Footer / Divider slots.',
  overview:
    'GlassCard is a compound primitive. Composition is opt-in — pass `GlassCard.Header`, `GlassCard.Body`, `GlassCard.Footer`, `GlassCard.Divider` in any order. The header announces title + subtitle in one focus stop with role="header"; the container surface announces with role="none" so screen readers do not double-read the group.',
  storyId: 'primitives--glasscard--all-personalities',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description:
        'Composed slots. Typically GlassCard.Header, GlassCard.Body, GlassCard.Footer, GlassCard.Divider.',
    },
    {
      name: 'elevation',
      type: '0 | 1 | 2 | 3',
      required: false,
      default: '1',
      description: 'Forwarded to the underlying GlassSurface.',
    },
    {
      name: 'radius',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill'",
      required: false,
      default: "'lg'",
      description: 'Corner radius of the card.',
    },
    {
      name: 'style',
      type: 'ViewStyle',
      required: false,
      description: 'Layout style for the outer wrapper (width, margin).',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      required: false,
      description: 'Optional container label — rarely needed when a header is present.',
    },
  ],
  slotProps: [
    {
      name: 'GlassCard.Header',
      props: [
        {
          name: 'title',
          type: 'string',
          required: true,
          description:
            'Visible title announced as heading. Combined with subtitle in one focus stop.',
        },
        {
          name: 'subtitle',
          type: 'string',
          required: false,
          description: 'Optional subtitle rendered below the title in textSecondary.',
        },
        {
          name: 'trailing',
          type: 'ReactNode',
          required: false,
          description:
            'Optional slot (usually an icon button). Anchored to the top of the header row so it does not overlap wrapped titles.',
        },
      ],
    },
    {
      name: 'GlassCard.Body',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Body content. Wrapped with consistent inner padding.',
        },
      ],
    },
    {
      name: 'GlassCard.Footer',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Footer row — typically two or three action buttons.',
        },
      ],
    },
    {
      name: 'GlassCard.Divider',
      props: [],
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Header + body + footer across the four themes.',
      storyId: 'primitives--glasscard--all-personalities',
    },
    {
      name: 'With trailing',
      description: 'Header trailing slot carrying an icon button.',
      storyId: 'primitives--glasscard--with-trailing',
    },
  ],
  examples: [
    {
      title: 'Standard card',
      description: 'Header, body, footer with a divider between body and footer.',
      code: `<GlassCard>
  <GlassCard.Header title="Upgrade available" subtitle="Absolute UI 0.1.0 ships new primitives." />
  <GlassCard.Body>
    <Text>Phase 2 adds the navigation family and the motion layer.</Text>
  </GlassCard.Body>
  <GlassCard.Divider />
  <GlassCard.Footer>
    <GlassButton onPress={dismiss}>Dismiss</GlassButton>
    <GlassButton onPress={install}>Install</GlassButton>
  </GlassCard.Footer>
</GlassCard>`,
    },
    {
      title: 'Header with trailing action',
      description: 'Use the trailing slot for an overflow icon or quick action.',
      code: `<GlassCard>
  <GlassCard.Header
    title="Shared with your team"
    subtitle="3 members"
    trailing={<GlassButton accessibilityLabel="More options" onPress={openMenu}>⋯</GlassButton>}
  />
  <GlassCard.Body>{children}</GlassCard.Body>
</GlassCard>`,
    },
  ],
  accessibility: [
    'Header combines title + subtitle into a single focus stop with role="header".',
    'Outer surface uses role="none" so the card is not announced as a container before its heading.',
    'Dynamic Type: title and subtitle scale with lineHeight=snug to avoid glyph clipping at the accessibility maximum.',
    'Trailing slot anchors to the top of the header row so it never overlaps a wrapped title.',
  ],
};

const glassSheet: PrimitiveDoc = {
  slug: 'glass-sheet',
  name: 'GlassSheet',
  phase: 1,
  tagline: 'Bottom-anchored sheet with scrim and explicit escape route.',
  overview:
    'GlassSheet is the bottom-edge modal. It mounts a scrim with accessibilityRole="button" labelled "Dismiss sheet" as the explicit VoiceOver/TalkBack escape route. Reduced Transparency swaps the glass for a solid surface and bumps the scrim alpha so the modal cue stays readable. Phase 1 has no motion; Phase 2 wires `theme.motion.overlay` through the surface.',
  storyId: 'primitives--glasssheet--all-personalities',
  props: [
    {
      name: 'visible',
      type: 'boolean',
      required: true,
      description: 'Controlled visibility. Renders nothing when false.',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      required: true,
      description: 'Fired when the scrim is pressed. Consumer must flip `visible` to false.',
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description:
        'Title rendered at the top of the sheet and announced as heading — serves as the accessible name.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      required: false,
      description: 'Fallback label used only when `title` is not set.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Body content rendered inside the sheet with 20pt padding.',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Tap to open the sheet on each theme; tap scrim or cancel to dismiss.',
      storyId: 'primitives--glasssheet--all-personalities',
    },
  ],
  examples: [
    {
      title: 'Share sheet',
      description: 'Simple open/close with a title and action list.',
      code: `const [open, setOpen] = useState(false);

<GlassButton onPress={() => setOpen(true)}>Share</GlassButton>

<GlassSheet
  visible={open}
  onDismiss={() => setOpen(false)}
  title="Share post"
>
  <GlassButton onPress={shareEveryone}>Everyone</GlassButton>
  <GlassButton onPress={shareFollowers}>Followers</GlassButton>
</GlassSheet>`,
    },
  ],
  accessibility: [
    'Scrim renders as a button labelled "Dismiss sheet" — the explicit escape route for VoiceOver/TalkBack in Phase 1.',
    'Reduced Transparency bumps the scrim alpha (dark themes: #FFFFFF26 → #FFFFFF66, light themes: #00000066 → #000000A6) and swaps the glass for a solid surface.',
    'Title announces with role="header" when set; otherwise the consumer-provided accessibilityLabel is used.',
    'Known Phase 2 gap: real focus trap + hardware-Escape. Today the scrim-button is the escape route.',
  ],
};

/* ------------------------------------------------------------------ */
/*  Phase 2 — Navigation family                                       */
/* ------------------------------------------------------------------ */

const glassNavBar: PrimitiveDoc = {
  slug: 'glass-nav-bar',
  name: 'GlassNavBar',
  phase: 2,
  tagline: 'Top navigation bar with centered title and leading / trailing slots.',
  overview:
    'GlassNavBar runs edge-to-edge at elevation 2 (above inline surfaces, below modals). The leading and trailing slots share equal width so the title stays optically centered even when only one side is populated. The title announces with role="header" once; the surrounding surface is role="none" to suppress redundant group announcements.',
  storyId: 'primitives--glassnavbar--all-personalities',
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Centered title text. Truncated to one line; full string is still announced.',
    },
    {
      name: 'leading',
      type: 'ReactNode',
      required: false,
      description: 'Leading slot — typically a back button or menu trigger.',
    },
    {
      name: 'trailing',
      type: 'ReactNode',
      required: false,
      description: 'Trailing slot — typically a search, edit, or overflow button.',
    },
    {
      name: 'elevation',
      type: '0 | 1 | 2 | 3',
      required: false,
      default: '2',
      description: 'Glass elevation. Defaults to 2 so the bar sits above inline content.',
    },
    {
      name: 'radius',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill'",
      required: false,
      default: "'none'",
      description: 'Corner radius. Defaults to none for the edge-to-edge classic look.',
    },
    {
      name: 'style',
      type: 'ViewStyle',
      required: false,
      description: 'Layout style for the outer wrapper.',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Bar with leading back button and trailing edit button on each theme.',
      storyId: 'primitives--glassnavbar--all-personalities',
    },
    {
      name: 'Title only',
      description: 'No slots — demonstrates the centered-title path.',
      storyId: 'primitives--glassnavbar--title-only',
    },
  ],
  examples: [
    {
      title: 'With back and edit slots',
      description: 'The classic three-slot nav bar.',
      code: `<GlassNavBar
  title="Inbox"
  leading={<GlassButton accessibilityLabel="Back" onPress={goBack}>←</GlassButton>}
  trailing={<GlassButton accessibilityLabel="Edit" onPress={edit}>Edit</GlassButton>}
/>`,
    },
    {
      title: 'Title-only bar',
      description: 'Drop the slots when there is nowhere to navigate back to.',
      code: `<GlassNavBar title="Discover" />`,
    },
  ],
  accessibility: [
    'Focus order is leading → title → trailing. The title is one focus stop with role="header".',
    'Slot children must meet the 44×44pt hit target — GlassButton enforces it for you.',
    'Long titles truncate visually via numberOfLines={1} but the full string is still announced because it is passed as Text children.',
    'Reduced Transparency is verified on both elevation 1 and elevation 2 by the theme-contrast regression suite.',
  ],
};

const glassTabBar: PrimitiveDoc = {
  slug: 'glass-tab-bar',
  name: 'GlassTabBar',
  phase: 2,
  tagline: 'Bottom tab bar with non-color selection cues and 44pt hit targets.',
  overview:
    'GlassTabBar renders a horizontal row of tabs. Active state is announced through two non-color cues: the label steps from weight 500 to 700 and a 2pt underline paints in the theme accent. Inactive tabs draw a transparent border in the same slot so selection swaps never shift layout. The bar exposes as a list; each tab as a button with its selected state.',
  storyId: 'primitives--glasstabbar--all-personalities',
  props: [
    {
      name: 'items',
      type: 'ReadonlyArray<GlassTabBarItem>',
      required: true,
      description:
        'Tabs to render. Each item needs a stable key, a label, and optional icon + accessibilityLabel.',
    },
    {
      name: 'activeKey',
      type: 'string',
      required: true,
      description: 'Key of the currently active tab — drives the weight and underline cues.',
    },
    {
      name: 'onTabPress',
      type: '(key: string) => void',
      required: true,
      description: 'Fires with the pressed tab key. Consumer updates activeKey.',
    },
    {
      name: 'elevation',
      type: '0 | 1 | 2 | 3',
      required: false,
      default: '2',
      description: 'Glass elevation.',
    },
    {
      name: 'radius',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill'",
      required: false,
      default: "'2xl'",
      description: 'Corner radius. The default 2xl matches the floating-island iOS treatment.',
    },
    {
      name: 'style',
      type: 'ViewStyle',
      required: false,
      description: 'Layout style for the outer wrapper.',
    },
  ],
  slotProps: [
    {
      name: 'GlassTabBarItem',
      props: [
        {
          name: 'key',
          type: 'string',
          required: true,
          description: 'Stable identifier used by activeKey and onTabPress.',
        },
        {
          name: 'label',
          type: 'string',
          required: true,
          description: 'Visible tab label.',
        },
        {
          name: 'leading',
          type: 'ReactNode',
          required: false,
          description: 'Optional leading node (usually an icon) rendered above the label.',
        },
        {
          name: 'accessibilityLabel',
          type: 'string',
          required: false,
          description:
            'Override the auto "{label}, tab" a11y label — required for icon-only rows.',
        },
      ],
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Tab bar with emoji icons and three tabs on each theme.',
      storyId: 'primitives--glasstabbar--all-personalities',
    },
  ],
  examples: [
    {
      title: 'Three-tab layout',
      description: 'Controlled active tab with emoji icons.',
      code: `const [active, setActive] = useState('home');

<GlassTabBar
  activeKey={active}
  onTabPress={setActive}
  items={[
    { key: 'home', label: 'Home', leading: <Text>🏠</Text> },
    { key: 'search', label: 'Search', leading: <Text>🔎</Text> },
    { key: 'profile', label: 'Profile', leading: <Text>👤</Text> },
  ]}
/>`,
    },
  ],
  accessibility: [
    'Each tab is a button announced as "{label}, tab" unless overridden by accessibilityLabel.',
    'Selected state is communicated via weight (500 → 700) and an accent underline — never color alone.',
    'Inactive tabs paint a transparent border in the underline slot so selection changes do not shift layout.',
    'Every tab meets the 44×44pt hit target enforced by style.ts.',
  ],
};

const glassModal: PrimitiveDoc = {
  slug: 'glass-modal',
  name: 'GlassModal',
  phase: 2,
  tagline: 'Centered dialog that composes a GlassSurface over a scrim.',
  overview:
    'GlassModal is the centered counterpart to GlassSheet. Same scrim contract, same "tap scrim to dismiss" escape route, same Reduced Transparency alpha bump. Content sits in the viewport center and grows to fit title + description + children. Phase 2 wires the motion layer with a scale-and-fade spring gated on Reduced Motion.',
  storyId: 'primitives--glassmodal--all-personalities',
  props: [
    {
      name: 'visible',
      type: 'boolean',
      required: true,
      description: 'Controls mount.',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      required: true,
      description: 'Fired when the scrim is pressed.',
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Title announced as heading and used as the accessible name.',
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Optional description rendered below the title in textSecondary.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      required: false,
      description: 'Fallback label — only used when neither title nor description is set.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      description: 'Optional content below the description — typically action buttons.',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Open/close a modal with title, description, and two buttons on each theme.',
      storyId: 'primitives--glassmodal--all-personalities',
    },
  ],
  examples: [
    {
      title: 'Confirmation dialog',
      description: 'Title + description + cancel / confirm buttons.',
      code: `const [open, setOpen] = useState(false);

<GlassModal
  visible={open}
  onDismiss={() => setOpen(false)}
  title="Delete draft?"
  description="This cannot be undone."
>
  <GlassButton onPress={() => setOpen(false)}>Cancel</GlassButton>
  <GlassButton onPress={deleteDraft}>Delete</GlassButton>
</GlassModal>`,
    },
  ],
  accessibility: [
    'Scrim renders as a button labelled "Dismiss dialog" — the explicit escape route.',
    'Title takes role="header" and serves as the accessible name of the dialog.',
    'Reduced Transparency bumps scrim alpha and collapses glass to the theme background.',
    'Phase 2 focus trap + hardware-Escape bindings land with the motion layer.',
  ],
};

const glassToast: PrimitiveDoc = {
  slug: 'glass-toast',
  name: 'GlassToast',
  phase: 2,
  tagline: 'Transient banner anchored to top or bottom with a role="status" announcement.',
  overview:
    'GlassToast is an ephemeral notification. It does not steal focus, it does not trap input, and it has no scrim. A leading stripe in the variant color is a structural cue — the message itself is still the accessible name so the announcement is never color-only. Consumers drive visibility from their own timer or async flow.',
  storyId: 'primitives--glasstoast--all-personalities',
  props: [
    {
      name: 'visible',
      type: 'boolean',
      required: true,
      description: 'Render gate — when false the toast unmounts entirely.',
    },
    {
      name: 'message',
      type: 'string',
      required: true,
      description: 'Visible message. Used as the accessible name unless accessibilityLabel is set.',
    },
    {
      name: 'variant',
      type: "'default' | 'success' | 'error' | 'info'",
      required: false,
      default: "'default'",
      description: 'Drives the stripe color. default uses theme.accent.',
    },
    {
      name: 'position',
      type: "'top' | 'bottom'",
      required: false,
      default: "'bottom'",
      description: 'Toast anchor.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      required: false,
      description: 'Override the message for screen readers when the visible text is too terse.',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'default / success / error / info across the four themes.',
      storyId: 'primitives--glasstoast--all-personalities',
    },
  ],
  examples: [
    {
      title: 'Auto-dismiss success',
      description: 'Toast driven by a useEffect timer in the parent.',
      code: `const [visible, setVisible] = useState(false);

function save() {
  persist();
  setVisible(true);
  setTimeout(() => setVisible(false), 2400);
}

<GlassToast visible={visible} message="Saved" variant="success" position="top" />`,
    },
  ],
  accessibility: [
    'Variant is communicated by a leading stripe — the message itself carries the full announcement.',
    'Toast does not trap focus; polite live-region announcement semantics are preserved.',
    'Phase 2 motion adds an enter/exit slide gated on Reduced Motion.',
  ],
};

/* ------------------------------------------------------------------ */
/*  Phase 3 — Inputs                                                  */
/* ------------------------------------------------------------------ */

const glassInput: PrimitiveDoc = {
  slug: 'glass-input',
  name: 'GlassInput',
  phase: 3,
  tagline: 'Text field with label, focus ring, invalid state, and helper text.',
  overview:
    'GlassInput is the text field primitive. It supports controlled and uncontrolled modes, renders a helper line below the field, and switches that helper (and the focus ring) to the danger color when `invalid` is true. Focus still wins visually over error so the user can see where they are typing. Secure text entry masks the value without losing the rest of the a11y contract.',
  storyId: 'primitives--glassinput--all-personalities',
  props: [
    {
      name: 'label',
      type: 'string',
      required: false,
      description:
        'Visible label above the field. Doubles as accessibilityLabel when no override is given.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Controlled value. Omit for uncontrolled mode with defaultValue.',
    },
    {
      name: 'onChangeText',
      type: '(text: string) => void',
      required: false,
      description: 'Fires on every keystroke.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      description: 'Placeholder text, hidden on focus — never rely on it as the sole label.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Paints the error ring and switches helper text to the danger color. Focus still wins over error visually.',
    },
    {
      name: 'helper',
      type: 'string',
      required: false,
      description: 'Helper text rendered below the field. Announced as accessibilityHint.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Dim to 0.4 opacity, suppress rings, announce disabled.',
    },
    {
      name: 'secureTextEntry',
      type: 'boolean',
      required: false,
      description: 'Mask input (password fields).',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Label + helper + invalid state across the four themes.',
      storyId: 'primitives--glassinput--all-personalities',
    },
  ],
  examples: [
    {
      title: 'Email field with inline error',
      description: 'Invalid flips the ring and helper to danger without losing the label.',
      code: `const [email, setEmail] = useState('');
const invalid = email.length > 0 && !email.includes('@');

<GlassInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  invalid={invalid}
  helper={invalid ? 'Use a valid email address' : 'We will never share your address'}
/>`,
    },
    {
      title: 'Password field',
      description: 'secureTextEntry masks the value; disabled dims the field.',
      code: `<GlassInput
  label="Password"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
/>`,
    },
  ],
  accessibility: [
    'Label is used as the accessible name when accessibilityLabel is not provided.',
    'Helper text is read as accessibilityHint.',
    'Invalid state sets accessibilityState.invalid = true and switches the ring color — the error is never communicated by color alone.',
    'Disabled state announces with accessibilityState.disabled = true and suppresses all focus/invalid rings.',
  ],
};

const glassSwitch: PrimitiveDoc = {
  slug: 'glass-switch',
  name: 'GlassSwitch',
  phase: 3,
  tagline: 'On/off control with 44pt thumb, focus ring, and decorative mode.',
  overview:
    'GlassSwitch is a single Pressable wrapping the optional label and the 52×32 track with a 24dp thumb. The whole row is the hit target so tapping the label toggles too. Disabled > focused > idle wins for styling. Omit onValueChange to render the switch as decorative — it still reflects the controlled value visually and is announced as disabled.',
  storyId: 'primitives--glassswitch--all-personalities',
  props: [
    {
      name: 'value',
      type: 'boolean',
      required: false,
      description: 'Controlled value. Omit for uncontrolled mode with defaultValue.',
    },
    {
      name: 'defaultValue',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Uncontrolled starting value. Ignored when value is set.',
    },
    {
      name: 'onValueChange',
      type: '(next: boolean) => void',
      required: false,
      description: 'Fires with the next value on press. Omit to render as decorative.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disable interaction and suppress the focus ring.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description:
        'Visible label left of the track. Doubles as accessibilityLabel when none is set.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      required: false,
      description: 'Explicit a11y label — overrides the visible label for screen readers.',
    },
    {
      name: 'style',
      type: 'ViewStyle',
      required: false,
      description: 'Layout style for the outer wrapper (margin, width).',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Wi-Fi on, Bluetooth off, Airplane mode uncontrolled, Hotspot disabled.',
      storyId: 'primitives--glassswitch--all-personalities',
    },
    {
      name: 'States',
      description: 'Off, on, disabled-off, disabled-on, decorative (no handler) on Aurora.',
      storyId: 'primitives--glassswitch--states',
    },
    {
      name: 'Settings row',
      description: 'Obsidian theme showing how a switch composes inside a list row.',
      storyId: 'primitives--glassswitch--settings-row',
    },
  ],
  examples: [
    {
      title: 'Controlled toggle',
      description: 'The whole row is the hit target.',
      code: `const [wifi, setWifi] = useState(true);

<GlassSwitch label="Wi-Fi" value={wifi} onValueChange={setWifi} />`,
    },
    {
      title: 'Decorative reflection',
      description:
        'Omitting onValueChange makes the switch read-only but keeps the visual in sync.',
      code: `<GlassSwitch label="System-wide" value={systemWide} />`,
    },
  ],
  accessibility: [
    'Announces as role="switch" with accessibilityState.checked = value.',
    'Disabled suppresses focus ring and announces with accessibilityState.disabled = true.',
    'Entire row (label + track) is the hit target — ≥ 44×44pt enforced in style.ts.',
    'No color-only state: the thumb flips position as well as tint.',
  ],
};

const glassSlider: PrimitiveDoc = {
  slug: 'glass-slider',
  name: 'GlassSlider',
  phase: 3,
  tagline: 'Range input with keyboard support, custom formatters, and a 44pt hit target.',
  overview:
    'GlassSlider follows the WAI-ARIA slider pattern. Arrow keys adjust by `step`, PageUp/PageDown take the 10× stride, Home/End jump to the bounds. It supports controlled and uncontrolled modes, a custom `formatValue` for the inline readout and the accessibilityValue.text string, and a `step={0}` mode for continuous ranges. Tap-to-position and pan gestures land in Phase 4 alongside the motion layer.',
  storyId: 'primitives--glassslider--all-personalities',
  props: [
    {
      name: 'value',
      type: 'number',
      required: false,
      description: 'Controlled value. Defaults to minimumValue when omitted and no defaultValue.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      required: false,
      description: 'Uncontrolled initial value.',
    },
    {
      name: 'onValueChange',
      type: '(next: number) => void',
      required: false,
      description: 'Fires with the snapped next value after every keyboard adjustment.',
    },
    {
      name: 'minimumValue',
      type: 'number',
      required: false,
      default: '0',
      description: 'Lower bound.',
    },
    {
      name: 'maximumValue',
      type: 'number',
      required: false,
      default: '100',
      description: 'Upper bound.',
    },
    {
      name: 'step',
      type: 'number',
      required: false,
      default: '1',
      description:
        'Step resolution. 0 means stepless — values are clamped but not snapped, pair with formatValue.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disable interaction and suppress the focus ring.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Visible label above the track. Used as accessibilityLabel when not overridden.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      required: false,
      description: 'Override of the a11y label.',
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      required: false,
      description:
        'Formatter used for the inline readout and accessibilityValue.text ("62%", "1.5×", "72°F").',
    },
    {
      name: 'showValue',
      type: 'boolean',
      required: false,
      description:
        'Whether to render the numeric readout next to the label. Defaults to true when formatValue is set.',
    },
    {
      name: 'style',
      type: 'ViewStyle',
      required: false,
      description: 'Layout style for the outer wrapper.',
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Volume (62%), Brightness (40%, step 5), Disabled (30%) across four themes.',
      storyId: 'primitives--glassslider--all-personalities',
    },
    {
      name: 'Keyboard',
      description: 'Aurora story with inline guidance for arrow / Home / End / PageUp / PageDown.',
      storyId: 'primitives--glassslider--keyboard',
    },
    {
      name: 'Ranges',
      description:
        'Zoom (0.5–4, step 0.1), Temperature (60–85°F), Rating (1–5 stars) — formatValue shapes every one.',
      storyId: 'primitives--glassslider--ranges',
    },
  ],
  examples: [
    {
      title: 'Volume slider',
      description: 'Simple controlled slider with a percent formatter.',
      code: `const [volume, setVolume] = useState(62);

<GlassSlider
  label="Volume"
  value={volume}
  onValueChange={setVolume}
  formatValue={(n) => \`\${n}%\`}
/>`,
    },
    {
      title: 'Temperature range',
      description: 'Custom range with step=1 and a Fahrenheit formatter.',
      code: `<GlassSlider
  label="Temperature"
  minimumValue={60}
  maximumValue={85}
  defaultValue={72}
  formatValue={(n) => \`\${n}°F\`}
/>`,
    },
  ],
  accessibility: [
    'Announces as role="adjustable" with accessibilityValue.min / max / now / text.',
    'Keyboard: ArrowLeft/Right/Up/Down step by `step`; PageUp/PageDown by 10×; Home/End jump to min/max.',
    'Disabled suppresses focus ring and announces with accessibilityState.disabled = true.',
    'formatValue powers both the inline readout and the spoken value — always in sync.',
  ],
};

const glassPicker: PrimitiveDoc = {
  slug: 'glass-picker',
  name: 'GlassPicker',
  phase: 3,
  tagline: 'Segmented single-select control with radiogroup semantics.',
  overview:
    'GlassPicker is a segmented control generic over the value type — pass a union of strings, numbers, or booleans and `onValueChange` is narrowed automatically. Each segment meets the 44dp hit target; selected text flips to `theme.onAccent` so contrast holds on every personality. Keyboard arrows wrap, Home/End jump to the first and last enabled items, disabled items are skipped. For more than ~5 options, reach for the sheet-backed menu that lands in Phase 4.',
  storyId: 'primitives--glasspicker--all-personalities',
  props: [
    {
      name: 'items',
      type: 'readonly GlassPickerItem<T>[]',
      required: true,
      description: 'Segments to render. Each item has a value, label, and optional disabled flag.',
    },
    {
      name: 'value',
      type: 'T',
      required: false,
      description: 'Controlled selection.',
    },
    {
      name: 'defaultValue',
      type: 'T',
      required: false,
      description: 'Uncontrolled initial selection.',
    },
    {
      name: 'onValueChange',
      type: '(next: T) => void',
      required: false,
      description: 'Fires with the next value after tap or keyboard activation.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disable the whole group and suppress the focus ring.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description:
        'Visible group label above the row. Doubles as accessibilityLabel when no override is given.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      required: false,
      description: 'Explicit group a11y label.',
    },
    {
      name: 'style',
      type: 'ViewStyle',
      required: false,
      description: 'Layout style for the outer wrapper.',
    },
  ],
  slotProps: [
    {
      name: 'GlassPickerItem<T>',
      props: [
        {
          name: 'value',
          type: 'T',
          required: true,
          description: 'Typed value — string, number, boolean, or any union.',
        },
        {
          name: 'label',
          type: 'string',
          required: true,
          description: 'Visible and accessible segment label.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          description: 'Disables this segment and skips it in keyboard navigation.',
        },
      ],
    },
  ],
  variants: [
    {
      name: 'All personalities',
      description: 'Range (Day/Week/Month/Year) and Density (Compact/Cozy/Comfortable).',
      storyId: 'primitives--glasspicker--all-personalities',
    },
    {
      name: 'States',
      description:
        'Two options, with a disabled item, and decorative (no handler) on the Aurora theme.',
      storyId: 'primitives--glasspicker--states',
    },
    {
      name: 'Keyboard',
      description: 'Obsidian story showing arrow wrap and Home/End jumps.',
      storyId: 'primitives--glasspicker--keyboard',
    },
  ],
  examples: [
    {
      title: 'Time range picker',
      description: 'A typed union as the value.',
      code: `type Range = 'day' | 'week' | 'month' | 'year';
const [range, setRange] = useState<Range>('week');

<GlassPicker
  label="Range"
  value={range}
  onValueChange={setRange}
  items={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ]}
/>`,
    },
    {
      title: 'Disabled option',
      description: 'Skip a value without removing it.',
      code: `<GlassPicker
  label="Tier"
  defaultValue="free"
  items={[
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'team', label: 'Team (soon)', disabled: true },
  ]}
/>`,
    },
  ],
  accessibility: [
    'Announces as role="radiogroup"; each segment as role="radio" with accessibilityState.checked.',
    'Keyboard arrows wrap; Home/End jump to the first/last enabled item; disabled items are skipped.',
    'Selected text color flips to theme.onAccent — APCA contract holds across all four personalities.',
  ],
};

export const primitives: PrimitiveDoc[] = [
  glassSurface,
  glassButton,
  glassCard,
  glassSheet,
  glassNavBar,
  glassTabBar,
  glassModal,
  glassToast,
  glassInput,
  glassSwitch,
  glassSlider,
  glassPicker,
];

/* ------------------------------------------------------------------ */
/*  Screens                                                            */
/* ------------------------------------------------------------------ */

export type ScreenDoc = {
  slug: string;
  name: string;
  tagline: string;
  storyId: string;
  description: string;
};

export const screens: ScreenDoc[] = [
  {
    slug: 'login',
    name: 'Login',
    tagline: 'Email + password entry with APCA-safe helper text.',
    storyId: 'screens--login--default',
    description:
      'Exercises GlassInput (email, password), GlassButton (primary + decorative), and GlassCard in a single form layout. Invalid-state wiring is real — try submitting with a blank email to see the error path.',
  },
  {
    slug: 'settings',
    name: 'Settings',
    tagline: 'Grouped rows with switches, pickers, and sliders.',
    storyId: 'screens--settings--default',
    description:
      'A classic settings list composed from GlassCard rows, GlassSwitch, GlassPicker, and GlassSlider. Demonstrates how to compose the phase 3 inputs without building a bespoke list container.',
  },
  {
    slug: 'now-playing',
    name: 'Now Playing',
    tagline: 'Media player with artwork, scrubber, and transport controls.',
    storyId: 'screens--nowplaying--default',
    description:
      'Uses GlassSurface, GlassSlider (step=0 continuous), GlassButton, and GlassTabBar in a real-world composition. The scrubber uses formatValue to render mm:ss timestamps.',
  },
];

/* ------------------------------------------------------------------ */
/*  Sidebar grouping helpers                                           */
/* ------------------------------------------------------------------ */

export type DocSection = {
  label: string;
  entries: Array<{ slug: string; name: string; href: string }>;
};

export function phaseSections(): DocSection[] {
  const phases: Record<1 | 2 | 3, PrimitiveDoc[]> = { 1: [], 2: [], 3: [] };
  for (const p of primitives) phases[p.phase].push(p);
  const labels: Record<1 | 2 | 3, string> = {
    1: 'Phase 1 — Core',
    2: 'Phase 2 — Navigation',
    3: 'Phase 3 — Inputs',
  };
  return ([1, 2, 3] as const).map((phase) => ({
    label: labels[phase],
    entries: phases[phase].map((p) => ({
      slug: p.slug,
      name: p.name,
      href: `/docs/primitives/${p.slug}`,
    })),
  }));
}

export function findPrimitive(slug: string): PrimitiveDoc | undefined {
  return primitives.find((p) => p.slug === slug);
}

export function findScreen(slug: string): ScreenDoc | undefined {
  return screens.find((s) => s.slug === slug);
}
