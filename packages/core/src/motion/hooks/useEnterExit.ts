/**
 * Manages the mount/unmount lifecycle of a conditionally-visible
 * component and drives its enter/exit animation via Reanimated.
 *
 * Pattern:
 *  - When visible becomes true  → set rendered=true, then animate to
 *    final values (opacity 1, scale 1, translateY 0).
 *  - When visible becomes false → animate to "from" values, then set
 *    rendered=false once the exit spring completes.
 *
 * Two animated styles are returned so callers can apply scale+fade to
 * their content surface and a simpler fade to the backdrop separately.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { spring } from '@absolute-ui/tokens';
import { useAbsoluteUI } from '../../theme-context.js';
import { instantTiming, toSpringConfig } from '../presets.js';

export type EnterExitConfig = {
  /** Which spring preset from @absolute-ui/tokens to use. Defaults to 'standard'. */
  springToken?: keyof typeof spring;
  /** Opacity when the element is hidden. Defaults to 0. */
  fromOpacity?: number;
  /** Scale when hidden. A value other than 1 enables the scale animation. */
  fromScale?: number;
  /** TranslateY (px) when hidden. A non-zero value enables the slide animation. */
  fromTranslateY?: number;
};

export type EnterExitResult = {
  /** False while fully exited — use to skip rendering children entirely. */
  rendered: boolean;
  /** Animated style for the content surface (opacity + optional scale/slide). */
  contentStyle: ReturnType<typeof useAnimatedStyle>;
  /** Animated style for an optional backdrop (opacity only). */
  backdropAnimStyle: ReturnType<typeof useAnimatedStyle>;
};

export function useEnterExit(visible: boolean, config: EnterExitConfig = {}): EnterExitResult {
  const springToken = config.springToken ?? 'standard';
  const fromOpacity = config.fromOpacity ?? 0;
  const fromScale = config.fromScale ?? 1;
  const fromTranslateY = config.fromTranslateY ?? 0;

  const hasScale = fromScale !== 1;
  const hasSlide = fromTranslateY !== 0;

  const { preferences } = useAbsoluteUI();
  const reducedMotion = preferences.reducedMotion;

  // rendered tracks whether the element should be in the tree at all.
  // Starts true when visible begins true so always-visible components
  // skip the first mount animation.
  const [rendered, setRendered] = useState(visible);

  // Initialize shared values at the correct target so already-visible
  // components don't animate on first render.
  const opacity = useSharedValue(visible ? 1 : fromOpacity);
  const scale = useSharedValue(visible ? 1 : fromScale);
  const translateY = useSharedValue(visible ? 0 : fromTranslateY);
  const backdropOpacity = useSharedValue(visible ? 1 : 0);

  const springCfg = toSpringConfig(spring[springToken]);

  // Stable callback to flip rendered off after the exit animation ends.
  const setHidden = useCallback(() => setRendered(false), []);

  // Step 1: mount immediately when visible flips to true.
  useEffect(() => {
    if (visible) setRendered(true);
  }, [visible]);

  // Step 2: drive the animation once the mount state has settled.
  useEffect(() => {
    if (!rendered) return;

    if (visible) {
      if (reducedMotion) {
        opacity.value = withTiming(1, instantTiming);
        backdropOpacity.value = withTiming(1, instantTiming);
        if (hasScale) scale.value = withTiming(1, instantTiming);
        if (hasSlide) translateY.value = withTiming(0, instantTiming);
      } else {
        opacity.value = withSpring(1, springCfg);
        backdropOpacity.value = withSpring(1, springCfg);
        if (hasScale) scale.value = withSpring(1, springCfg);
        if (hasSlide) translateY.value = withSpring(0, springCfg);
      }
    } else {
      // Animate out. Only opacity triggers the unmount callback so we
      // don't race between multiple animation completions.
      if (reducedMotion) {
        opacity.value = withTiming(fromOpacity, instantTiming, (finished) => {
          if (finished) runOnJS(setHidden)();
        });
        backdropOpacity.value = withTiming(0, instantTiming);
        if (hasScale) scale.value = withTiming(fromScale, instantTiming);
        if (hasSlide) translateY.value = withTiming(fromTranslateY, instantTiming);
      } else {
        opacity.value = withSpring(fromOpacity, springCfg, (finished) => {
          if (finished) runOnJS(setHidden)();
        });
        backdropOpacity.value = withSpring(0, springCfg);
        if (hasScale) scale.value = withSpring(fromScale, springCfg);
        if (hasSlide) translateY.value = withSpring(fromTranslateY, springCfg);
      }
    }
    // Deps intentionally only include the triggers — spring configs and
    // fromXxx values are treated as stable constants set by each component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, rendered]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      ...(hasScale ? [{ scale: scale.value }] : []),
      ...(hasSlide ? [{ translateY: translateY.value }] : []),
    ] as { scale?: number; translateY?: number }[],
  }));

  const backdropAnimStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return { rendered, contentStyle, backdropAnimStyle };
}
