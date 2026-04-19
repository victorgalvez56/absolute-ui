/* eslint-disable @typescript-eslint/no-explicit-any */
import Animated from 'react-native-reanimated';

// Re-cast to bypass the React 18/19 ReactNode structural mismatch (TS2786).
// AnimatedComponentType's return type resolves against workspace-root @types/react@19
// (which adds `bigint` to ReactNode), but packages/core compiles against @types/react@18.
// The two ReactNode types are structurally incompatible; `any` sidesteps the check
// while preserving prop-type safety at the call site via the surrounding ViewProps usage.
// See types/react-native.d.ts for the full version-conflict rationale.
export const AnimatedView = Animated.View as unknown as (props: any) => any;
