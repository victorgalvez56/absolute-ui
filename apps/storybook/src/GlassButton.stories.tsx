import { GlassButton } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassButton> = {
  title: 'Primitives/GlassButton',
  component: GlassButton,
  parameters: {
    docs: {
      description: {
        component:
          'Interactive liquid-glass button. 44pt hit target, APCA-verified label contrast on every elevation.',
      },
    },
  },
  argTypes: {
    elevation: {
      control: { type: 'inline-radio' },
      options: [0, 1, 2, 3],
    },
    radius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', 'pill'],
    },
    disabled: { control: { type: 'boolean' } },
    children: { control: { type: 'text' } },
    accessibilityLabel: { control: { type: 'text' } },
    accessibilityHint: { control: { type: 'text' } },
  },
  args: {
    children: 'Continue',
    accessibilityLabel: 'Primary action',
    elevation: 1,
    radius: 'pill',
    disabled: false,
    onPress: action('onPress'),
  },
};

export default meta;
type Story = StoryObj<typeof GlassButton>;

export const Playground: Story = {
  render: (args) => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora}>
        <GlassButton {...args} />
      </Backdrop>
    </ThemedProvider>
  ),
};

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid
      minHeight={260}
      minColumnWidth={300}
      render={() => (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}
        >
          <GlassButton
            accessibilityLabel="Primary action"
            onPress={action('Continue')}
          >
            Continue
          </GlassButton>
          <GlassButton accessibilityLabel="Disabled action" disabled>
            Disabled
          </GlassButton>
          <GlassButton
            accessibilityLabel="Secondary action at elevation 2"
            elevation={2}
            radius="md"
            onPress={action('Learn more')}
          >
            Learn more
          </GlassButton>
        </div>
      )}
    />
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'start',
          }}
        >
          <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>idle</div>
          <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>disabled</div>
          <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>
            elevation 3
          </div>
          <GlassButton accessibilityLabel="Idle button" onPress={action('idle')}>
            Ship it
          </GlassButton>
          <GlassButton accessibilityLabel="Disabled button" disabled>
            Ship it
          </GlassButton>
          <GlassButton
            accessibilityLabel="High elevation button"
            elevation={3}
            onPress={action('elevated')}
          >
            Ship it
          </GlassButton>
        </div>
      </Backdrop>
    </ThemedProvider>
  ),
};
