import { GlassSwitch } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassSwitch> = {
  title: 'Primitives/GlassSwitch',
  component: GlassSwitch,
  parameters: {
    docs: {
      description: {
        component:
          'On/off control with a 44pt thumb, keyboard focus ring, and Pressable label so tapping the row flips the switch.',
      },
    },
  },
  argTypes: {
    label: { control: { type: 'text' } },
    value: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    label: 'Wi-Fi',
    value: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSwitch>;

export const Playground: Story = {
  render: (args) => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={200}>
        <div style={{ maxWidth: 320 }}>
          <GlassSwitch {...args} />
        </div>
      </Backdrop>
    </ThemedProvider>
  ),
};

function PersonalitySwatch() {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <GlassSwitch label="Wi-Fi" value={wifi} onValueChange={setWifi} />
      <GlassSwitch label="Bluetooth" value={bluetooth} onValueChange={setBluetooth} />
      <GlassSwitch label="Airplane mode" defaultValue={false} onValueChange={() => {}} />
      <GlassSwitch label="Hotspot (disabled)" defaultValue={true} disabled />
    </div>
  );
}

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PersonalitiesGrid minHeight={320} render={() => <PersonalitySwatch />} />,
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={340}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
          <GlassSwitch label="Off" defaultValue={false} onValueChange={() => {}} />
          <GlassSwitch label="On" defaultValue={true} onValueChange={() => {}} />
          <GlassSwitch label="Disabled (off)" defaultValue={false} disabled />
          <GlassSwitch label="Disabled (on)" defaultValue={true} disabled />
          <GlassSwitch label="Decorative (no handler)" defaultValue={true} />
        </div>
      </Backdrop>
    </ThemedProvider>
  ),
};
