import type { Preview } from '@storybook/react';

/**
 * Global Storybook parameters shared by every on-device story.
 * The matchers wire up addon-ondevice-controls so any arg ending in
 * `Date` renders as a date picker and anything matching `background`
 * or `color` renders as a color picker. Individual stories can still
 * override or extend these through their own `argTypes`.
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
