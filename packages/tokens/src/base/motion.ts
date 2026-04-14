export const duration = {
  instant: 0,
  fast: 120,
  base: 200,
  slow: 320,
  slower: 480,
} as const;

export type DurationToken = keyof typeof duration;

export const easing = {
  linear: [0, 0, 1, 1],
  standard: [0.2, 0, 0, 1],
  emphasized: [0.3, 0, 0, 1],
  accelerate: [0.4, 0, 1, 1],
  decelerate: [0, 0, 0.2, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type EasingToken = keyof typeof easing;

export type SpringConfig = {
  stiffness: number;
  damping: number;
  mass: number;
};

export const spring = {
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  standard: { stiffness: 180, damping: 18, mass: 1 },
  snappy: { stiffness: 260, damping: 22, mass: 1 },
  wobbly: { stiffness: 140, damping: 10, mass: 1 },
} as const satisfies Record<string, SpringConfig>;

export type SpringToken = keyof typeof spring;
