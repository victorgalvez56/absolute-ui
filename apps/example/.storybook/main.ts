import type { StorybookConfig } from '@storybook/react-native';

/**
 * On-device Storybook config for the Absolute UI example app.
 *
 * Stories live next to this config — we deliberately do NOT pull
 * from `apps/ladle/src/*.stories.tsx`, because those stories import
 * `react-native-web` primitives (divs, spans, CSS grid) aliased to
 * RN. Running them under a real React Native runtime would crash.
 * The files under `./stories/` are RN-native equivalents that use
 * `View` / `Text` / `Pressable` directly.
 */
const main: StorybookConfig = {
  stories: ['./stories/**/*.stories.?(ts|tsx)'],
  addons: ['@storybook/addon-ondevice-actions', '@storybook/addon-ondevice-controls'],
};

export default main;
