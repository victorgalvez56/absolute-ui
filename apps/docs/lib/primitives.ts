/**
 * Static metadata for every Absolute UI primitive exposed in the docs.
 * Kept here (not in @absolute-ui/core) because the docs site is the
 * only consumer that needs a flat list indexed by slug for routing.
 */

export type PrimitiveDoc = {
  slug: string;
  name: string;
  tagline: string;
  /** Story ID inside the Ladle playground. */
  storyId: string;
  /** Hand-written prop table, or null for a "coming soon" placeholder. */
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
  }> | null;
};

export const primitives: PrimitiveDoc[] = [
  {
    slug: 'glass-surface',
    name: 'GlassSurface',
    tagline: 'Base liquid-glass primitive every other component composes.',
    storyId: 'primitives--glasssurface--all-personalities',
    props: [
      {
        name: 'elevation',
        type: '0 | 1 | 2 | 3',
        required: false,
        default: '1',
        description:
          'Selects the glass recipe. Higher elevations have more blur, more saturation, and a stronger tint.',
      },
      {
        name: 'radius',
        type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill'",
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
  },
  {
    slug: 'glass-button',
    name: 'GlassButton',
    tagline: 'Interactive liquid-glass button with 44pt hit target and APCA-safe label.',
    storyId: 'primitives--glassbutton--all-personalities',
    props: [
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
          'Hint describing what happens on press (e.g. "opens the share sheet"). Read after the label.',
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
        type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill'",
        required: false,
        default: "'pill'",
        description: 'Corner radius. Pill is the classic liquid-glass capsule.',
      },
      {
        name: 'children',
        type: 'ReactNode',
        required: true,
        description:
          'Label or composition of icon + text. Strings are wrapped in a themed Text automatically.',
      },
    ],
  },
  {
    slug: 'glass-input',
    name: 'GlassInput',
    tagline: 'Text field with focus ring, invalid state, and helper text.',
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
        description: 'Controlled value. Omit for uncontrolled mode with `defaultValue`.',
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
  },
  {
    slug: 'glass-card',
    name: 'GlassCard',
    tagline: 'Content container with optional trailing slot.',
    storyId: 'primitives--glasscard--all-personalities',
    props: null,
  },
  {
    slug: 'glass-modal',
    name: 'GlassModal',
    tagline: 'Centered dialog with scrim and focus trap.',
    storyId: 'primitives--glassmodal--all-personalities',
    props: null,
  },
  {
    slug: 'glass-sheet',
    name: 'GlassSheet',
    tagline: 'Edge-anchored sheet with drag-to-dismiss.',
    storyId: 'primitives--glasssheet--all-personalities',
    props: null,
  },
  {
    slug: 'glass-nav-bar',
    name: 'GlassNavBar',
    tagline: 'Top navigation bar that blurs content underneath.',
    storyId: 'primitives--glassnavbar--all-personalities',
    props: null,
  },
  {
    slug: 'glass-tab-bar',
    name: 'GlassTabBar',
    tagline: 'Bottom tab bar with segmented hit targets.',
    storyId: 'primitives--glasstabbar--all-personalities',
    props: null,
  },
  {
    slug: 'glass-switch',
    name: 'GlassSwitch',
    tagline: 'On/off control with 44pt thumb and focus ring.',
    storyId: 'primitives--glassswitch--all-personalities',
    props: null,
  },
  {
    slug: 'glass-slider',
    name: 'GlassSlider',
    tagline: 'Range input with labeled thumb and keyboard support.',
    storyId: 'primitives--glassslider--all-personalities',
    props: null,
  },
  {
    slug: 'glass-picker',
    name: 'GlassPicker',
    tagline: 'Segmented or menu-style option picker.',
    storyId: 'primitives--glasspicker--all-personalities',
    props: null,
  },
  {
    slug: 'glass-toast',
    name: 'GlassToast',
    tagline: 'Transient banner announced as a polite live region.',
    storyId: 'primitives--glasstoast--all-personalities',
    props: null,
  },
];

export const screens = [
  {
    slug: 'login',
    name: 'Login',
    tagline: 'Email + password entry with APCA-safe helper text.',
    storyId: 'screens--login--default',
  },
  {
    slug: 'settings',
    name: 'Settings',
    tagline: 'Grouped rows with switches, pickers, and sliders.',
    storyId: 'screens--settings--default',
  },
  {
    slug: 'now-playing',
    name: 'Now Playing',
    tagline: 'Media player with artwork, scrubber, and transport controls.',
    storyId: 'screens--nowplaying--default',
  },
];

export function findPrimitive(slug: string): PrimitiveDoc | undefined {
  return primitives.find((p) => p.slug === slug);
}
