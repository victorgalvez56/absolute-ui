/**
 * Converts @absolute-ui/tokens spring/timing configs into the shapes
 * that react-native-reanimated's withSpring / withTiming expect.
 */
import type { SpringConfig } from '@absolute-ui/tokens';
import type { WithSpringConfig, WithTimingConfig } from 'react-native-reanimated';

export function toSpringConfig(config: SpringConfig): WithSpringConfig {
  return {
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
  };
}

/** Zero-duration timing config — used when reducedMotion is active. */
export const instantTiming: WithTimingConfig = { duration: 0 };
