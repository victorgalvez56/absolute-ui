/* Auto-generated file — do not edit by hand.
 *
 * Storybook React Native discovers stories at runtime via `require.context`.
 * Metro resolves that through the `@storybook/react-native/metro/withStorybook`
 * wrapper. Regenerate this file with:
 *
 *     pnpm --filter @absolute-ui/example exec sb-rn-get-stories
 *
 * Keeping this checked in (rather than only generated) means `pnpm storybook`
 * works on a fresh clone without an extra bootstrap step.
 */

import { start, updateView } from '@storybook/react-native';

import '@storybook/addon-ondevice-controls/register';
import '@storybook/addon-ondevice-actions/register';

const normalizedStories = [
  {
    titlePrefix: '',
    directory: './.storybook/stories',
    files: '**/*.stories.?(ts|tsx|js|jsx)',
    importPathMatcher:
      /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
    // @ts-ignore
    req: require.context(
      './stories',
      true,
      /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
    ),
  },
];

declare global {
  // eslint-disable-next-line no-var
  var storybookView: ReturnType<typeof start>;
  // eslint-disable-next-line no-var
  var STORIES: typeof normalizedStories;
}

const annotations = [
  require('./preview'),
  require('@storybook/react-native/dist/preview'),
  require('@storybook/addon-actions/preview'),
];

global.STORIES = normalizedStories;

// @ts-ignore
module?.hot?.accept?.();

if (!global.storybookView) {
  global.storybookView = start({
    annotations,
    storyEntries: normalizedStories,
  });
} else {
  updateView(global.storybookView, annotations, normalizedStories);
}

export const view = global.storybookView;
