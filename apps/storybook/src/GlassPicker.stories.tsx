import { GlassPicker, type GlassPickerItem } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

type RangeValue = 'day' | 'week' | 'month' | 'year';
type DensityValue = 'compact' | 'cozy' | 'comfortable';

const rangeItems: readonly GlassPickerItem<RangeValue>[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const densityItems: readonly GlassPickerItem<DensityValue>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'comfortable', label: 'Comfortable' },
];

const meta: Meta<typeof GlassPicker> = {
  title: 'Primitives/GlassPicker',
  component: GlassPicker,
  parameters: {
    docs: {
      description: {
        component:
          'Segmented option picker. Arrow keys move between options (wrapping), Home/End jump to the first/last enabled option.',
      },
    },
  },
  argTypes: {
    label: { control: { type: 'text' } },
    disabled: { control: { type: 'boolean' } },
  },
  args: {
    label: 'Range',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof GlassPicker>;

function PlaygroundRender(args: { label?: string; disabled?: boolean }) {
  const [range, setRange] = useState<RangeValue>('week');
  return (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={220}>
        <div style={{ maxWidth: 420 }}>
          <GlassPicker
            label={args.label ?? 'Range'}
            items={rangeItems}
            value={range}
            onValueChange={setRange}
            disabled={args.disabled ?? false}
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
  const [range, setRange] = useState<RangeValue>('week');
  const [density, setDensity] = useState<DensityValue>('cozy');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
      <GlassPicker label="Range" items={rangeItems} value={range} onValueChange={setRange} />
      <GlassPicker
        label="Density"
        items={densityItems}
        value={density}
        onValueChange={setDensity}
      />
      <GlassPicker label="Disabled" items={rangeItems} defaultValue="month" disabled />
    </div>
  );
}

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid minHeight={300} minColumnWidth={420} render={() => <PersonalitySwatch />} />
  ),
};

function StatesDemo() {
  const [twoOption, setTwoOption] = useState<'off' | 'on'>('off');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
      <GlassPicker
        label="Two options"
        items={
          [
            { value: 'off', label: 'Off' },
            { value: 'on', label: 'On' },
          ] as const
        }
        value={twoOption}
        onValueChange={setTwoOption}
      />
      <GlassPicker
        label="With a disabled item"
        items={[
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'team', label: 'Team (soon)', disabled: true },
        ]}
        defaultValue="free"
        onValueChange={() => {}}
      />
      <GlassPicker label="Decorative (no handler)" items={rangeItems} defaultValue="week" />
    </div>
  );
}

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={360}>
        <StatesDemo />
      </Backdrop>
    </ThemedProvider>
  ),
};
