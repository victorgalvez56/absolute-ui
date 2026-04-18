/**
 * Entry component for the on-device Storybook mode.
 *
 * `index.js` imports this module by path when the `STORYBOOK=1` env
 * flag is set — it is the RN-side mirror of `App.tsx`. We keep a
 * dedicated file (rather than pointing `AppRegistry` at `./index`
 * directly) so future wrapping logic (analytics, perf overlays,
 * a Maestro harness) has one obvious seam to plug into without
 * polluting the Storybook host in `./index.tsx`.
 */
import StorybookUIRoot from './index';

export default StorybookUIRoot;
