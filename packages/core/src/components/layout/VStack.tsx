import type { ReactNode } from 'react';
import { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { type BoxLayoutProps, buildVStackStyle } from './style.js';

export type VStackProps = BoxLayoutProps &
  Omit<ViewProps, 'style'> & {
    style?: ViewStyle;
    children?: ReactNode;
  };

/**
 * Vertical flex column with token-driven spacing. Default gap is `md`
 * (12pt) and default cross-axis alignment is `stretch` — children
 * take the full available width unless the caller overrides.
 */
export const VStack = forwardRef<unknown, VStackProps>(function VStack(props, ref) {
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
  const resolved = buildVStackStyle({
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
