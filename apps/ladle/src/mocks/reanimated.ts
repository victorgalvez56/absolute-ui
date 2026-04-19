/**
 * Web-compatible stub for react-native-reanimated used by Ladle stories.
 *
 * Reanimated requires a Babel/Metro plugin to transform worklets, which
 * is unavailable in Vite. This stub replaces the package via a Vite
 * alias and provides instant-transition equivalents of every API the
 * @absolute-ui/core motion layer uses.
 *
 * Animations become instant (duration 0) so Ladle stories always
 * show the correct final visual state without any transition delay.
 * The `useSharedValue` implementation stores values in React state so
 * `useAnimatedStyle` re-evaluates when a value changes.
 */
import { useRef, useState } from 'react';
import { View, Text, ScrollView, type ViewProps, type TextProps, type ScrollViewProps } from 'react-native';

// ---- Shared value -----------------------------------------------------------

export type SharedValue<T> = { value: T };

export function useSharedValue<T>(initialValue: T): SharedValue<T> {
  const [, forceRender] = useState(0);
  const stateRef = useRef<T>(initialValue);
  const sv = useRef<SharedValue<T>>({
    get value() {
      return stateRef.current;
    },
    set value(next: T) {
      stateRef.current = next;
      forceRender((n) => n + 1);
    },
  });
  return sv.current;
}

// ---- Animated style ---------------------------------------------------------

// On web we re-invoke the style factory every render — shared-value
// mutations via the setter trigger a forceRender so the style stays fresh.
export function useAnimatedStyle<T extends Record<string, unknown>>(
  factory: () => T,
): T {
  return factory();
}

// ---- Spring / timing --------------------------------------------------------

// Return the target value immediately. Also invoke the callback (if
// provided) synchronously so the unmount path in useEnterExit fires.
export function withSpring<T>(
  toValue: T,
  _config?: unknown,
  callback?: (finished?: boolean) => void,
): T {
  callback?.(true);
  return toValue;
}

export function withTiming<T>(
  toValue: T,
  _config?: unknown,
  callback?: (finished?: boolean) => void,
): T {
  callback?.(true);
  return toValue;
}

// ---- runOnJS ----------------------------------------------------------------

// On the JS thread already — just return the function as-is.
export function runOnJS<T extends (...args: never[]) => unknown>(fn: T): T {
  return fn;
}

// ---- Animated namespace (Animated.View etc.) --------------------------------

const AnimatedView = (props: ViewProps) => View(props);
const AnimatedText = (props: TextProps) => Text(props);
const AnimatedScrollView = (props: ScrollViewProps) => ScrollView(props);

const Animated = {
  View: AnimatedView,
  Text: AnimatedText,
  ScrollView: AnimatedScrollView,
  createAnimatedComponent: <P extends object>(Component: React.ComponentType<P>) => Component,
};

export default Animated;
