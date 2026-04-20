/**
 * Minimal type shim for react-native, re-exported as the surface that
 * `@absolute-ui/core` uses. At runtime the pnpm override redirects
 * `react-native` to `react-native-web`, but RN-web does not ship its
 * own TypeScript types, so we declare just the subset we consume.
 *
 * This shim intentionally grows as new primitives are added — when
 * you reach for a new RN API, add its types here.
 *
 * Implementation notes
 * --------------------
 * • All optional props include `| undefined` explicitly because
 *   the tsconfigs in this repo enable `exactOptionalPropertyTypes`.
 * • Component functions return `any` to bypass a React 18 vs 19
 *   ReactElement structural mismatch. This shim's `import from 'react'`
 *   resolves to the workspace-root @types/react@19 (hoisted by
 *   apps/example), while packages/core's own compilation uses
 *   @types/react@18 from its local node_modules. The two ReactElement
 *   definitions differ in the default type param (any vs unknown),
 *   causing TS2786 whenever both are visible in the same compilation.
 *   Using `any` as the return type keeps full prop-type checking while
 *   sidestepping the irresolvable cross-version JSX element check.
 */
declare module 'react-native' {
  import type { CSSProperties, ReactNode, Ref } from 'react';

  export type ViewStyle = CSSProperties & {
    // Extra fields used by GlassSurface on web that aren't in CSSProperties
    backdropFilter?: string | undefined;
    WebkitBackdropFilter?: string | undefined;
  };

  export type TextStyle = ViewStyle;

  export type AccessibilityRole =
    | 'none'
    | 'button'
    | 'link'
    | 'header'
    | 'image'
    | 'text'
    | 'summary'
    | 'list'
    | 'listitem'
    | 'switch'
    | 'checkbox'
    | 'adjustable'
    | 'radio'
    | 'radiogroup';

  export type AccessibilityState = {
    disabled?: boolean | undefined;
    selected?: boolean | undefined;
    checked?: boolean | 'mixed' | undefined;
    busy?: boolean | undefined;
    expanded?: boolean | undefined;
  };

  export type AccessibilityValue = {
    min?: number | undefined;
    max?: number | undefined;
    now?: number | undefined;
    text?: string | undefined;
  };

  export type LayoutChangeEvent = {
    nativeEvent: {
      layout: { x: number; y: number; width: number; height: number };
    };
  };

  export type KeyboardEventLike = {
    key: string;
    preventDefault: () => void;
    stopPropagation: () => void;
  };

  // Props are typed with `T | undefined` (not just optional) so callers
  // under `exactOptionalPropertyTypes: true` can pass the result of a
  // `resolveX()` helper that returns `string | undefined` straight into
  // the prop without threading conditional-spread boilerplate.
  export type ViewProps = {
    style?: ViewStyle | ReadonlyArray<ViewStyle | false | null | undefined> | undefined;
    children?: ReactNode | undefined;
    accessibilityRole?: AccessibilityRole | undefined;
    accessibilityLabel?: string | undefined;
    accessibilityHint?: string | undefined;
    accessibilityState?: AccessibilityState | undefined;
    accessibilityValue?: AccessibilityValue | undefined;
    accessible?: boolean | undefined;
    testID?: string | undefined;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only' | undefined;
    onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
    onKeyDown?: ((event: KeyboardEventLike) => void) | undefined;
    ref?: Ref<unknown> | undefined;
  };

  export type TextProps = ViewProps & {
    numberOfLines?: number | undefined;
    allowFontScaling?: boolean | undefined;
  };

  export type PressableStateCallbackType = {
    pressed: boolean;
    hovered?: boolean | undefined;
    focused?: boolean | undefined;
  };

  export type PressableProps = Omit<ViewProps, 'style' | 'children'> & {
    onPress?: (() => void) | undefined;
    onPressIn?: (() => void) | undefined;
    onPressOut?: (() => void) | undefined;
    onLongPress?: (() => void) | undefined;
    disabled?: boolean | undefined;
    hitSlop?: number | { top?: number; bottom?: number; left?: number; right?: number } | undefined;
    style?:
      | ViewStyle
      | ReadonlyArray<ViewStyle | false | null | undefined>
      | ((
          state: PressableStateCallbackType,
        ) => ViewStyle | ReadonlyArray<ViewStyle | false | null | undefined>)
      | undefined;
    children?: ReactNode | ((state: PressableStateCallbackType) => ReactNode) | undefined;
  };

  export type ScrollViewProps = ViewProps & {
    contentContainerStyle?: ViewStyle | undefined;
    horizontal?: boolean | undefined;
    showsHorizontalScrollIndicator?: boolean | undefined;
    showsVerticalScrollIndicator?: boolean | undefined;
    bounces?: boolean | undefined;
  };

  export type KeyboardType =
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'number-pad'
    | 'decimal-pad'
    | 'url'
    | 'visible-password';

  export type TextInputProps = Omit<ViewProps, 'style' | 'children'> & {
    value?: string | undefined;
    defaultValue?: string | undefined;
    placeholder?: string | undefined;
    placeholderTextColor?: string | undefined;
    editable?: boolean | undefined;
    secureTextEntry?: boolean | undefined;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
    autoCorrect?: boolean | undefined;
    autoFocus?: boolean | undefined;
    keyboardType?: KeyboardType | undefined;
    maxLength?: number | undefined;
    multiline?: boolean | undefined;
    numberOfLines?: number | undefined;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | undefined;
    onChangeText?: ((text: string) => void) | undefined;
    onFocus?: (() => void) | undefined;
    onBlur?: (() => void) | undefined;
    onSubmitEditing?: (() => void) | undefined;
    style?: TextStyle | ReadonlyArray<TextStyle | false | null | undefined> | undefined;
    allowFontScaling?: boolean | undefined;
    'aria-invalid'?: boolean | undefined;
  };

  // Components return `any` — see the file-level comment above for why.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function View(props: ViewProps): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function Text(props: TextProps): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function Pressable(props: PressableProps): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function ScrollView(props: ScrollViewProps): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function TextInput(props: TextInputProps): any;
}
