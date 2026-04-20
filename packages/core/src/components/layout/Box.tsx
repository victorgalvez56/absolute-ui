import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { type BoxLayoutProps, buildBoxStyle } from './style.js';

export type BoxProps = BoxLayoutProps &
  Omit<ViewProps, 'style'> & {
    /**
     * Escape-hatch style. Merges on top of the resolved spacing props
     * so a caller can tweak individual rules without losing the token
     * contract (`p`, `m`, `gap`).
     */
    style?: ViewStyle;
    children?: ReactNode;
  };

/**
 * Box is the layout atom. A View with Tailwind-ish spacing shorthands
 * (`p`, `px`, `py`, `m`, `mx`, `gap`, …) resolved against the shared
 * `@absolute-ui/tokens` spacing scale.
 *
 * Use Box for non-glass containers (plain View + spacing tokens). For
 * the liquid-glass aesthetic reach for `GlassSurface` or `GlassCard`
 * instead — Box intentionally does not render a glass surface so it
 * stays cheap and composable.
 */
export const Box = forwardRef<unknown, BoxProps>(function Box(props, ref) {
  const {
    p,
    px,
    py,
    pt,
    pb,
    pl,
    pr,
    m,
    mx,
    my,
    mt,
    mb,
    ml,
    mr,
    gap,
    flex,
    alignItems,
    justifyContent,
    alignSelf,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    backgroundColor,
    borderRadius,
    style,
    children,
    ...rest
  } = props;
  const resolved = buildBoxStyle({
    p,
    px,
    py,
    pt,
    pb,
    pl,
    pr,
    m,
    mx,
    my,
    mt,
    mb,
    ml,
    mr,
    gap,
    flex,
    alignItems,
    justifyContent,
    alignSelf,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    backgroundColor,
    borderRadius,
  }) as ViewStyle;
  return (
    <View ref={ref} style={[resolved, style]} {...rest}>
      {children}
    </View>
  );
});
