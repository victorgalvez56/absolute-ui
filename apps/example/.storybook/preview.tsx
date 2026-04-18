import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Preview } from '@storybook/react';
import type { ReactNode } from 'react';
import { View } from 'react-native';

function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <AbsoluteUIContext.Provider
      value={{ theme: themes.aurora, preferences: defaultPreferences }}
    >
      <View style={{ flex: 1, padding: 16, backgroundColor: themes.aurora.colors.background }}>
        {children}
      </View>
    </AbsoluteUIContext.Provider>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [(Story) => <ThemeWrapper><Story /></ThemeWrapper>],
};

export default preview;
