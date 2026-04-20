import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { type BoxLayoutProps, buildHStackStyle } from './style.js';

export type HStackProps = BoxLayoutProps &
  Omit<ViewProps, 'style'> & {
    style?: ViewStyle;
    children?: ReactNode;
  };

/**
 * Horizontal flex row with token-driven spacing. Default gap is `md`
 * (12pt) and default cross-axis alignment is `center` — the common
 * case when you're placing an icon next to a label. Any of these
 * defaults can be overridden per-instance.
 */
export const HStack = forwardRef<unknown, HStackProps>(function HStack(props, ref) {
  const { style, children, ...rest } = props;
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
    ...viewProps
  } = rest;
  const resolved = buildHStackStyle({
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
    <View ref={ref} style={[resolved, style]} {...viewProps}>
      {children}
    </View>
  );
});
