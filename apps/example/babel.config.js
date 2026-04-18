/**
 * The transform-inline-environment-variables plugin bakes selected
 * env vars into the JS bundle at transpile time so
 * `process.env.STORYBOOK` reaches runtime — without it the normal-
 * app / Storybook switch never flips.
 *
 * The react-native-worklets/plugin is required by
 * react-native-gesture-handler 2.x (pulled in by Storybook React
 * Native for its swipe UI) to compile worklet functions. It MUST
 * be listed last per the Reanimated/Worklets docs.
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['transform-inline-environment-variables', { include: ['STORYBOOK'] }],
    'react-native-worklets/plugin',
  ],
};
