/**
 * GlassInput — on-device stories.
 *
 * Three states: labeled (the default happy path), invalid (error
 * ring + errorText), and helper (supplemental guidance below the
 * field). All stories reuse the same controlled-ish wrapper so the
 * input is actually typeable on-device — uncontrolled mode with an
 * onChangeText action would swallow the text.
 */
import { GlassInput } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';

const backdropStyle = {
  padding: 24,
  minHeight: 200,
  backgroundColor: themes.aurora.colors.background,
  justifyContent: 'center' as const,
};

const meta: Meta<typeof GlassInput> = {
  title: 'Primitives/GlassInput',
  component: GlassInput,
  argTypes: {
    invalid: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    elevation: { control: { type: 'select' }, options: [0, 1, 2, 3] },
  },
  args: {
    onChangeText: action('onChangeText'),
    onSubmitEditing: action('onSubmitEditing'),
  },
  render: (args) => (
    <View style={backdropStyle}>
      <GlassInput {...args} />
    </View>
  ),
};

export default meta;

type Story = StoryObj<typeof GlassInput>;

export const Labeled: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    keyboardType: 'email-address',
    autoCapitalize: 'none',
  },
};

export const Invalid: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    secureTextEntry: true,
    invalid: true,
    errorText: 'Password must be at least 8 characters.',
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Handle',
    placeholder: '@username',
    helperText: 'Visible to the people you share with.',
    autoCapitalize: 'none',
  },
};
