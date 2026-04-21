import { GlassButton, GlassToast } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassToast> = {
  title: 'Primitives/GlassToast',
  component: GlassToast,
  parameters: {
    docs: {
      description: {
        component:
          'Ephemeral banner. Consumers drive `visible` via a timer or async result — the toast itself is stateless.',
      },
    },
  },
  argTypes: {
    message: { control: { type: 'text' } },
    variant: {
      control: { type: 'inline-radio' },
      options: ['default', 'success', 'error', 'info'],
    },
    position: { control: { type: 'inline-radio' }, options: ['top', 'bottom'] },
  },
  args: {
    message: 'Preferences saved',
    variant: 'success',
    position: 'bottom',
  },
};

export default meta;
type Story = StoryObj<typeof GlassToast>;

function Demo(args: {
  message?: string;
  variant?: 'default' | 'success' | 'error' | 'info';
  position?: 'top' | 'bottom';
}) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [visible]);
  return (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={320}>
        <div style={{ position: 'relative', minHeight: 240 }}>
          <GlassButton accessibilityLabel="Show toast" onPress={() => setVisible(true)}>
            Show toast
          </GlassButton>
          <GlassToast
            visible={visible}
            message={args.message ?? 'Preferences saved'}
            variant={args.variant ?? 'success'}
            position={args.position ?? 'bottom'}
          />
        </div>
      </Backdrop>
    </ThemedProvider>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Demo message={args.message} variant={args.variant} position={args.position} />
  ),
};

function PersonalitySwatch({
  themeName,
}: {
  themeName: keyof typeof themes;
}) {
  return (
    <div style={{ position: 'relative', minHeight: 220 }}>
      <GlassToast visible={true} message={`${themes[themeName].label} toast`} variant="success" />
    </div>
  );
}

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid
      minHeight={280}
      render={(theme) => <PersonalitySwatch themeName={theme.name as keyof typeof themes} />}
    />
  ),
};
