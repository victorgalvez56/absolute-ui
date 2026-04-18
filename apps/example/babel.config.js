/**
 * The transform-inline-environment-variables plugin bakes selected
 * env vars into the JS bundle at transpile time. Without it,
 * `process.env.STORYBOOK` inside `index.js` is always undefined at
 * runtime — Metro doesn't inject shell env into the bundle by
 * default — and the Storybook / normal-app switch would never flip.
 *
 * We whitelist only STORYBOOK so unrelated shell env (PATH, USER,
 * SHELL, etc.) never ends up in the bundle.
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'transform-inline-environment-variables',
      { include: ['STORYBOOK'] },
    ],
  ],
};
