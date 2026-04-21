import { GlassTabBar } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Text } from 'react-native';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const ITEMS = [
  { key: 'home', label: 'Home', leading: <Text>🏠</Text> },
  { key: 'search', label: 'Search', leading: <Text>🔍</Text> },
  { key: 'library', label: 'Library', leading: <Text>📚</Text> },
  { key: 'profile', label: 'Profile', leading: <Text>👤</Text> },
];

const meta: Meta<typeof GlassTabBar> = {
  title: 'Primitives/GlassTabBar',
  component: GlassTabBar,
  parameters: {
    docs: {
      description: {
        component: 'Bottom tab bar with segmented hit targets. 44pt minimum per tab.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassTabBar>;

function Demo({ themeName }: { themeName?: keyof typeof themes }) {
  const theme = themes[themeName ?? 'aurora'];
  const [activeKey, setActiveKey] = useState('home');
  return (
    <ThemedProvider theme={theme}>
      <Backdrop theme={theme} minHeight={260}>
        <div
          style={{
            color: theme.colors.textPrimary,
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          {theme.label} · active: {activeKey}
        </div>
        <GlassTabBar items={ITEMS} activeKey={activeKey} onTabPress={setActiveKey} />
      </Backdrop>
    </ThemedProvider>
  );
}

export const Playground: Story = {
  render: () => <Demo themeName="aurora" />,
};

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid
      minHeight={280}
      minColumnWidth={360}
      render={(theme) => <Demo themeName={theme.name as keyof typeof themes} />}
    />
  ),
};
