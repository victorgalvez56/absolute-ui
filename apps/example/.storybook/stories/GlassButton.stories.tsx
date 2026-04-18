/**
 * GlassButton — on-device stories.
 *
 * Each variant renders on top of a theme-colored backdrop so the
 * glass recipe is visible. `onPress` uses the storybook actions
 * addon so taps appear in the on-device action log panel.
 */
import { GlassButton } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

const backdropStyle = {
  padding: 24,
  minHeight: 180,
  backgroundColor: themes.aurora.colors.background,
  alignItems: 'flex-start' as const,
  justifyContent: 'center' as const,
};

const meta: Meta<typeof GlassButton> = {
  title: 'Primitives/GlassButton',
  component: GlassButton,
  argTypes: {
    elevation: {
      control: { type: 'select' },
      options: [0, 1, 2, 3],
    },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    children: 'Continue',
    accessibilityLabel: 'Primary action',
    onPress: action('onPress'),
  },
  render: (args) => (
    <View style={backdropStyle}>
      <GlassButton {...args} />
    </View>
  ),
};

export default meta;

type Story = StoryObj<typeof GlassButton>;

export const Primary: Story = {
  args: { children: 'Continue', elevation: 1 },
};

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true, accessibilityLabel: 'Disabled action' },
};

export const Elevated: Story = {
  args: {
    children: 'Learn more',
    elevation: 2,
    radius: 'md',
    accessibilityLabel: 'Secondary action at elevation 2',
  },
};
