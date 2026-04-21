import { GlassSlider } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassSlider> = {
  title: 'Primitives/GlassSlider',
  component: GlassSlider,
  parameters: {
    docs: {
      description: {
        component:
          'Range input with labeled thumb. Supports keyboard (arrow keys, Home / End, PageUp / PageDown) and reports the accessibilityValue the platform expects.',
      },
    },
  },
  argTypes: {
    label: { control: { type: 'text' } },
    minimumValue: { control: { type: 'number' } },
    maximumValue: { control: { type: 'number' } },
    step: { control: { type: 'number' } },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    label: 'Volume',
    minimumValue: 0,
    maximumValue: 100,
    step: 1,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassSlider>;

function PlaygroundRender(args: {
  label?: string;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(50);
  return (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={220}>
        <div style={{ maxWidth: 380 }}>
          <GlassSlider
            label={args.label ?? 'Volume'}
            value={value}
            onValueChange={setValue}
            minimumValue={args.minimumValue ?? 0}
            maximumValue={args.maximumValue ?? 100}
            step={args.step ?? 1}
            disabled={args.disabled ?? false}
            formatValue={(v) => `${v}%`}
          />
        </div>
      </Backdrop>
    </ThemedProvider>
  );
}

export const Playground: Story = {
  render: (args) => <PlaygroundRender {...args} />,
};

function PersonalitySwatch() {
  const [volume, setVolume] = useState(62);
  const [brightness, setBrightness] = useState(40);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 360 }}>
      <GlassSlider
        label="Volume"
        value={volume}
        onValueChange={setVolume}
        formatValue={(v) => `${v}%`}
      />
      <GlassSlider
        label="Brightness"
        value={brightness}
        onValueChange={setBrightness}
        minimumValue={0}
        maximumValue={100}
        step={5}
        formatValue={(v) => `${v}%`}
      />
      <GlassSlider label="Disabled" defaultValue={30} disabled formatValue={(v) => `${v}%`} />
    </div>
  );
}

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PersonalitiesGrid minHeight={340} render={() => <PersonalitySwatch />} />,
};

function RangesDemo() {
  const [zoom, setZoom] = useState(1);
  const [temperature, setTemperature] = useState(72);
  const [rating, setRating] = useState(3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 420 }}>
      <GlassSlider
        label="Zoom"
        value={zoom}
        onValueChange={setZoom}
        minimumValue={0.5}
        maximumValue={4}
        step={0.1}
        formatValue={(v) => `${v.toFixed(1)}x`}
      />
      <GlassSlider
        label="Temperature"
        value={temperature}
        onValueChange={setTemperature}
        minimumValue={60}
        maximumValue={85}
        step={1}
        formatValue={(v) => `${v}°F`}
      />
      <GlassSlider
        label="Rating"
        value={rating}
        onValueChange={setRating}
        minimumValue={1}
        maximumValue={5}
        step={1}
        formatValue={(v) => `${v} / 5`}
      />
    </div>
  );
}

export const Ranges: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ThemedProvider theme={themes.obsidian}>
      <Backdrop theme={themes.obsidian} minHeight={420}>
        <RangesDemo />
      </Backdrop>
    </ThemedProvider>
  ),
};
