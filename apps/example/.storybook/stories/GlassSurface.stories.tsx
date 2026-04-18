/**
 * GlassSurface — on-device stories.
 *
 * Real React Native imports only. The backdrop is a plain View with
 * a solid, theme-aware color rather than a CSS radial gradient (the
 * Ladle stories use gradients; RN has no direct equivalent without
 * a gradient library). Four stories exercise elevation 0, 1, 2, 3.
 */
import { GlassSurface } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { Text, View } from 'react-native';

type GlassSurfaceStoryArgs = {
  elevation: 0 | 1 | 2 | 3;
  radius: 'sm' | 'md' | 'lg' | 'xl' | 'pill';
};

const backdropStyle = {
  padding: 24,
  minHeight: 180,
  backgroundColor: themes.aurora.colors.background,
  justifyContent: 'center' as const,
};

const meta: Meta<GlassSurfaceStoryArgs> = {
  title: 'Primitives/GlassSurface',
  argTypes: {
    elevation: {
      control: { type: 'select' },
      options: [0, 1, 2, 3],
    },
    radius: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'pill'],
    },
  },
  args: {
    elevation: 1,
    radius: 'lg',
  },
  render: (args) => (
    <View style={backdropStyle}>
      <GlassSurface
        elevation={args.elevation}
        radius={args.radius}
        style={{ padding: 20, minHeight: 120, justifyContent: 'center' }}
      >
        <Text style={{ color: themes.aurora.colors.textPrimary, fontSize: 18, fontWeight: '600' }}>
          Liquid Glass
        </Text>
        <Text style={{ color: themes.aurora.colors.textSecondary, fontSize: 13, marginTop: 4 }}>
          elevation {args.elevation} · radius {args.radius}
        </Text>
      </GlassSurface>
    </View>
  ),
};

export default meta;

type Story = StoryObj<GlassSurfaceStoryArgs>;

export const Elevation0: Story = { args: { elevation: 0 } };
export const Elevation1: Story = { args: { elevation: 1 } };
export const Elevation2: Story = { args: { elevation: 2 } };
export const Elevation3: Story = { args: { elevation: 3 } };
