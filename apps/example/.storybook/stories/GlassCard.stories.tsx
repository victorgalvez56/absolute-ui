/**
 * GlassCard — on-device stories.
 *
 * Exercises the compound Header / Body / Footer / Divider slots
 * with a small product-style card that shows how consumers are
 * expected to compose the primitive.
 */
import { GlassButton, GlassCard } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Text, View } from 'react-native';

const backdropStyle = {
  padding: 24,
  minHeight: 220,
  backgroundColor: themes.aurora.colors.background,
  justifyContent: 'center' as const,
};

const meta: Meta<typeof GlassCard> = {
  title: 'Primitives/GlassCard',
  component: GlassCard,
  argTypes: {
    elevation: { control: { type: 'select' }, options: [0, 1, 2, 3] },
    radius: { control: { type: 'select' }, options: ['sm', 'md', 'lg', 'xl', 'pill'] },
  },
  args: { elevation: 1, radius: 'lg' },
};

export default meta;

type Story = StoryObj<typeof GlassCard>;

export const Compound: Story = {
  render: (args) => (
    <View style={backdropStyle}>
      <GlassCard {...args}>
        <GlassCard.Header title="Now Playing" subtitle="Aurora · Liquid Glass Mix" />
        <GlassCard.Divider />
        <GlassCard.Body>
          <Text style={{ color: themes.aurora.colors.textSecondary, fontSize: 14 }}>
            Four tracks queued. The card itself is a GlassSurface with header, body, divider, and
            footer slots layered inside.
          </Text>
        </GlassCard.Body>
        <GlassCard.Divider />
        <GlassCard.Footer>
          <GlassButton accessibilityLabel="Play mix" onPress={action('play')}>
            Play
          </GlassButton>
        </GlassCard.Footer>
      </GlassCard>
    </View>
  ),
};

export const HeaderOnly: Story = {
  render: (args) => (
    <View style={backdropStyle}>
      <GlassCard {...args}>
        <GlassCard.Header title="Settings" subtitle="Theme · Motion · A11y" />
      </GlassCard>
    </View>
  ),
};

export const WithTrailing: Story = {
  render: (args) => (
    <View style={backdropStyle}>
      <GlassCard {...args}>
        <GlassCard.Header
          title="Profile"
          subtitle="victor.galvez56@gmail.com"
          trailing={
            <GlassButton accessibilityLabel="Edit profile" onPress={action('edit')} radius="pill">
              Edit
            </GlassButton>
          }
        />
      </GlassCard>
    </View>
  ),
};
