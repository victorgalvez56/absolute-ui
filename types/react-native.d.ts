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
  import type { ComponentType, CSSProperties, Ref, ReactNode } from 'react';

  export type ViewStyle = CSSProperties & {
    // Extra fields used by GlassSurface on web that aren't in CSSProperties
    backdropFilter?: string;
    WebkitBackdropFilter?: string;
  };

  export type AccessibilityRole =
    | 'none'
    | 'button'
    | 'link'
    | 'header'
    | 'image'
    | 'text'
    | 'summary'
    | 'list'
    | 'listitem';

  export type ViewProps = {
    style?: ViewStyle | ReadonlyArray<ViewStyle | false | null | undefined>;
    children?: ReactNode;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    accessible?: boolean;
    testID?: string;
    ref?: Ref<unknown>;
  };

  export const View: ComponentType<ViewProps>;
}
