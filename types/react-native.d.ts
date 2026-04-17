/**
 * Minimal type shim for react-native, re-exported as the surface that
 * `@absolute-ui/core` uses. At runtime the pnpm override redirects
 * `react-native` to `react-native-web`, but RN-web does not ship its
 * own TypeScript types, so we declare just the subset we consume.
 *
 * This shim intentionally grows as new primitives are added — when
 * you reach for a new RN API, add its types here.
 */
declare module 'react-native' {
  import type { ComponentType, CSSProperties, ReactNode, Ref } from 'react';

  export type ViewStyle = CSSProperties & {
    // Extra fields used by GlassSurface on web that aren't in CSSProperties
    backdropFilter?: string;
    WebkitBackdropFilter?: string;
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
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };

  export type AccessibilityValue = {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
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

  export type ViewProps = {
    style?: ViewStyle | ReadonlyArray<ViewStyle | false | null | undefined>;
    children?: ReactNode;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    accessibilityState?: AccessibilityState;
    accessibilityValue?: AccessibilityValue;
    accessible?: boolean;
    testID?: string;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
    onLayout?: (event: LayoutChangeEvent) => void;
    onKeyDown?: (event: KeyboardEventLike) => void;
    ref?: Ref<unknown>;
  };

  export type TextProps = ViewProps & {
    numberOfLines?: number;
    allowFontScaling?: boolean;
  };

  export type PressableStateCallbackType = {
    pressed: boolean;
    hovered?: boolean;
    focused?: boolean;
  };

  export type PressableProps = Omit<ViewProps, 'style' | 'children'> & {
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    onLongPress?: () => void;
    disabled?: boolean;
    hitSlop?: number | { top?: number; bottom?: number; left?: number; right?: number };
    style?:
      | ViewStyle
      | ReadonlyArray<ViewStyle | false | null | undefined>
      | ((
          state: PressableStateCallbackType,
        ) => ViewStyle | ReadonlyArray<ViewStyle | false | null | undefined>);
    children?: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
  };

  export type ScrollViewProps = ViewProps & {
    contentContainerStyle?: ViewStyle;
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    bounces?: boolean;
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
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    placeholderTextColor?: string;
    editable?: boolean;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    autoCorrect?: boolean;
    autoFocus?: boolean;
    keyboardType?: KeyboardType;
    maxLength?: number;
    multiline?: boolean;
    numberOfLines?: number;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
    onChangeText?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onSubmitEditing?: () => void;
    style?: TextStyle | ReadonlyArray<TextStyle | false | null | undefined>;
    allowFontScaling?: boolean;
    'aria-invalid'?: boolean;
  };

  export const View: ComponentType<ViewProps>;
  export const Text: ComponentType<TextProps>;
  export const Pressable: ComponentType<PressableProps>;
  export const ScrollView: ComponentType<ScrollViewProps>;
  export const TextInput: ComponentType<TextInputProps>;
}
