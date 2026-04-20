import { GlassInput } from '@absolute-ui/core';
import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassInput> = {
  title: 'Primitives/GlassInput',
  component: GlassInput,
  parameters: {
    docs: {
      description: {
        component:
          'Text field with focus ring, invalid state, and helper text. Label doubles as the accessibilityLabel when no override is provided.',
      },
    },
  },
  argTypes: {
    label: { control: { type: 'text' } },
    placeholder: { control: { type: 'text' } },
    helperText: { control: { type: 'text' } },
    errorText: { control: { type: 'text' } },
    defaultValue: { control: { type: 'text' } },
    invalid: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
    secureTextEntry: { control: { type: 'boolean' } },
  },
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: 'We never share your email.',
    invalid: false,
    disabled: false,
    secureTextEntry: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassInput>;

export const Playground: Story = {
  render: (args) => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={260}>
        <div style={{ maxWidth: 360 }}>
          <GlassInput {...args} />
        </div>
      </Backdrop>
    </ThemedProvider>
  ),
};

function PersonalitySwatch() {
  const [email, setEmail] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
      <GlassInput
        label="Email"
        placeholder="you@example.com"
        helperText="We never share your email."
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <GlassInput
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        autoCapitalize="none"
      />
      <GlassInput label="Disabled field" defaultValue="Read-only value" disabled />
    </div>
  );
}

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid minHeight={380} render={() => <PersonalitySwatch />} />
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
          <GlassInput label="Idle" placeholder="Tap to focus" />
          <GlassInput
            label="With helper text"
            placeholder="you@example.com"
            helperText="We never share your email."
          />
          <GlassInput
            label="Invalid"
            placeholder="you@example.com"
            defaultValue="not-an-email"
            invalid
            errorText="Please enter a valid email address."
          />
          <GlassInput
            label="Invalid with helper"
            placeholder="username"
            defaultValue=""
            invalid
            errorText="Username is required."
            helperText="3-20 characters, letters and numbers only."
          />
          <GlassInput label="Disabled" defaultValue="Read-only" disabled />
        </div>
      </Backdrop>
    </ThemedProvider>
  ),
};

export const ReducedTransparency: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <AbsoluteUIContext.Provider
      value={{
        theme: themes.obsidian,
        preferences: { ...defaultPreferences, reducedTransparency: true },
      }}
    >
      <Backdrop theme={themes.obsidian}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
          <div style={{ color: themes.obsidian.colors.textSecondary, fontSize: 12 }}>
            Reduced Transparency: glass recipe falls back to a solid surface via
            resolveGlassRecipe. Focus and error rings remain visible.
          </div>
          <GlassInput label="Email" placeholder="you@example.com" />
          <GlassInput
            label="With error"
            defaultValue="bad"
            invalid
            errorText="Please enter a valid email."
          />
        </div>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  ),
};
