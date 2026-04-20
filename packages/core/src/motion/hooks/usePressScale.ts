/**
 * Provides onPressIn / onPressOut handlers and a matching animated
 * style that scales down slightly on press and springs back on release.
 * Respects reducedMotion — the scale stays at 1 when motion is off.
 */
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { spring } from '@absolute-ui/tokens';
import { useAbsoluteUI } from '../../theme-context.js';
import { toSpringConfig } from '../presets.js';

const PRESSED_SCALE = 0.95;
const snappyCfg = toSpringConfig(spring.snappy);

export type PressScaleResult = {
  onPressIn: () => void;
  onPressOut: () => void;
  pressStyle: ReturnType<typeof useAnimatedStyle>;
};

export function usePressScale(): PressScaleResult {
  const { preferences } = useAbsoluteUI();
  const scale = useSharedValue(1);

  const onPressIn = () => {
    if (preferences.reducedMotion) return;
    scale.value = withSpring(PRESSED_SCALE, snappyCfg);
  };

  const onPressOut = () => {
    if (preferences.reducedMotion) return;
    scale.value = withSpring(1, snappyCfg);
  };

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { onPressIn, onPressOut, pressStyle };
}
