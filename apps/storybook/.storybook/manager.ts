import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const absoluteUITheme = create({
  base: 'dark',
  brandTitle: 'Absolute UI · Playground',
  brandUrl: 'https://absolute-ui.dev',
  brandTarget: '_blank',
  colorPrimary: '#7a5cff',
  colorSecondary: '#ff6fb4',
  appBg: '#0b0b12',
  appContentBg: '#0e0e17',
  appPreviewBg: '#0e0e17',
  appBorderColor: '#1f2030',
  appBorderRadius: 8,
  textColor: '#e8e8f0',
  textInverseColor: '#0b0b12',
  barTextColor: '#a0a4c0',
  barSelectedColor: '#7a5cff',
  barBg: '#0e0e17',
  inputBg: '#15162a',
  inputBorder: '#1f2030',
  inputTextColor: '#e8e8f0',
  inputBorderRadius: 6,
});

addons.setConfig({
  theme: absoluteUITheme,
  sidebar: {
    showRoots: true,
  },
});
