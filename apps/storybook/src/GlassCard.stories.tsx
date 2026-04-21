import { GlassButton, GlassCard } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassCard> = {
  title: 'Primitives/GlassCard',
  component: GlassCard,
  parameters: {
    docs: {
      description: {
        component:
          'Content container with an optional header trailing slot. Composes GlassSurface plus compound Header / Body / Footer / Divider parts.',
      },
    },
  },
  argTypes: {
    elevation: { control: { type: 'inline-radio' }, options: [0, 1, 2, 3] },
    radius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', 'pill'],
    },
  },
  args: {
    elevation: 2,
    radius: 'lg',
  },
};

export default meta;
type Story = StoryObj<typeof GlassCard>;

export const Playground: Story = {
  render: (args) => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={380}>
        <GlassCard {...args}>
          <GlassCard.Header
            title="Upgrade available"
            subtitle="Absolute UI 0.1.0 ships the new liquid glass primitives."
          />
          <GlassCard.Divider />
          <GlassCard.Body>
            <Text style={{ color: themes.aurora.colors.textPrimary, fontSize: 14, lineHeight: 20 }}>
              Four personalities, APCA-aware contrast on every glass recipe, and a compound
              GlassCard API.
            </Text>
          </GlassCard.Body>
          <GlassCard.Footer>
            <GlassButton accessibilityLabel="Dismiss" onPress={action('Dismiss')}>
              Dismiss
            </GlassButton>
            <GlassButton
              accessibilityLabel="Install the update"
              onPress={action('Install')}
              elevation={2}
            >
              Install
            </GlassButton>
          </GlassCard.Footer>
        </GlassCard>
      </Backdrop>
    </ThemedProvider>
  ),
};

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid
      minHeight={380}
      minColumnWidth={380}
      render={(theme) => (
        <GlassCard elevation={2} radius="lg">
          <GlassCard.Header
            title="Upgrade available"
            subtitle="Absolute UI 0.1.0 ships the new liquid glass primitives."
          />
          <GlassCard.Divider />
          <GlassCard.Body>
            <Text style={{ color: theme.colors.textPrimary, fontSize: 14, lineHeight: 20 }}>
              The release includes four personalities, an APCA-aware contrast check on every
              glass recipe, and a compound GlassCard API.
            </Text>
          </GlassCard.Body>
          <GlassCard.Footer>
            <GlassButton accessibilityLabel="Dismiss" onPress={action('Dismiss')}>
              Dismiss
            </GlassButton>
            <GlassButton
              accessibilityLabel="Install the update"
              onPress={action('Install')}
              elevation={2}
            >
              Install
            </GlassButton>
          </GlassCard.Footer>
        </GlassCard>
      )}
    />
  ),
};

export const WithTrailing: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora}>
        <GlassCard>
          <GlassCard.Header
            title="Notifications"
            subtitle="3 unread"
            trailing={
              <GlassButton
                accessibilityLabel="Mark all as read"
                onPress={action('Mark read')}
                radius="pill"
              >
                Mark read
              </GlassButton>
            }
          />
          <GlassCard.Divider />
          <GlassCard.Body>
            <Text
              style={{ color: themes.aurora.colors.textSecondary, fontSize: 14, lineHeight: 20 }}
            >
              The trailing slot accepts any ReactNode. In this example it's a GlassButton, but
              it could be an icon, a badge, or a menu trigger.
            </Text>
          </GlassCard.Body>
        </GlassCard>
      </Backdrop>
    </ThemedProvider>
  ),
};
