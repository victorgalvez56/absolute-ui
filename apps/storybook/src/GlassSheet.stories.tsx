import { GlassButton, GlassSheet } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Text } from 'react-native';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassSheet> = {
  title: 'Primitives/GlassSheet',
  component: GlassSheet,
  parameters: {
    docs: {
      description: {
        component: 'Edge-anchored sheet with drag-to-dismiss and scrim tap-to-close.',
      },
    },
  },
  argTypes: {
    title: { control: { type: 'text' } },
  },
  args: {
    title: 'Share post',
  },
};

export default meta;
type Story = StoryObj<typeof GlassSheet>;

function SheetDemo({ theme, title }: { theme: Theme; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <ThemedProvider theme={theme}>
      <Backdrop theme={theme} minHeight={440}>
        <GlassButton accessibilityLabel="Open the sheet" onPress={() => setOpen(true)}>
          Open sheet
        </GlassButton>
        <GlassSheet visible={open} onDismiss={() => setOpen(false)} title={title}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: 14, marginBottom: 16 }}>
            Choose who can see this. The sheet dismisses when you tap the scrim outside the card
            or press Cancel.
          </Text>
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            <GlassButton accessibilityLabel="Share to everyone" onPress={() => setOpen(false)}>
              Everyone
            </GlassButton>
            <GlassButton
              accessibilityLabel="Share to friends only"
              onPress={() => setOpen(false)}
            >
              Friends only
            </GlassButton>
            <GlassButton accessibilityLabel="Cancel" onPress={() => setOpen(false)}>
              Cancel
            </GlassButton>
          </div>
        </GlassSheet>
      </Backdrop>
    </ThemedProvider>
  );
}

export const Playground: Story = {
  render: (args) => <SheetDemo theme={themes.aurora} title={args.title ?? 'Share post'} />,
};

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid
      minHeight={460}
      render={(theme) => <SheetDemo theme={theme} title="Share post" />}
    />
  ),
};
