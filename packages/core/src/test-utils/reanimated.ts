/**
 * Test stub for react-native-reanimated.
 *
 * Aliased via vitest.config.ts `resolve.alias` so every test file that
 * imports from 'react-native-reanimated' gets this module instead.
 * Animations become instant (zero duration, synchronous) so tests always
 * see the correct final visual state, and the useEnterExit unmount path
 * fires deterministically inside act().
 *
 * Contract mirrors apps/ladle/src/mocks/reanimated.ts — keep them in sync.
 */
import { createElement, useRef, useState } from 'react';
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

export function useAnimatedStyle<T extends Record<string, unknown>>(factory: () => T): T {
  return factory();
}

// ---- Spring / timing --------------------------------------------------------

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

export function runOnJS<T extends (...args: never[]) => unknown>(fn: T): T {
  return fn;
}

// ---- Animated namespace -----------------------------------------------------

// createElement handles forwardRef + class components correctly — calling
// a forwardRef as a plain function throws in the vitest SSR CJS context.
const AnimatedView = (props: ViewProps) => createElement(View, props);
const AnimatedText = (props: TextProps) => createElement(Text, props);
const AnimatedScrollView = (props: ScrollViewProps) => createElement(ScrollView, props);

const Animated = {
  View: AnimatedView,
  Text: AnimatedText,
  ScrollView: AnimatedScrollView,
  createAnimatedComponent: <P extends object>(Component: React.ComponentType<P>) => Component,
};

export default Animated;
