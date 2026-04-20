import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassPicker, type GlassPickerItem } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { useState } from 'react';

export default {
  title: 'Primitives / GlassPicker',
};

type RangeValue = 'day' | 'week' | 'month' | 'year';

const rangeItems: readonly GlassPickerItem<RangeValue>[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

type DensityValue = 'compact' | 'cozy' | 'comfortable';

const densityItems: readonly GlassPickerItem<DensityValue>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'comfortable', label: 'Comfortable' },
];

function Backdrop({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 32,
        borderRadius: 20,
        minHeight: 280,
        background: theme.dark
          ? 'radial-gradient(1200px at 20% 10%, #7a5cff 0%, #0f1020 60%)'
          : 'radial-gradient(1200px at 20% 10%, #ffc36b 0%, #f6eede 60%)',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}

function Swatch({ theme }: { theme: Theme }) {
  const [range, setRange] = useState<RangeValue>('week');
  const [density, setDensity] = useState<DensityValue>('cozy');
  return (
    <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
      <Backdrop theme={theme}>
        <div
          style={{
            color: theme.colors.textPrimary,
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          {theme.label}
        </div>
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
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
}

export const AllPersonalities = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(400px, 1fr))',
      gap: 24,
      padding: 24,
    }}
  >
    {Object.values(themes).map((theme) => (
      <Swatch key={theme.name} theme={theme} />
    ))}
  </div>
);

export const States = () => {
  const [twoOption, setTwoOption] = useState<'off' | 'on'>('off');
  return (
    <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
      <Backdrop theme={themes.aurora}>
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
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
};

export const ReducedMotion = () => {
  // Left: selected indicator slides between segments (standard spring).
  // Right: reducedMotion=true, so the indicator jumps to the new segment
  // with no animation. Tapping between options on each side shows the
  // same selection outcome with different motion characteristics.
  const [left, setLeft] = useState<RangeValue>('week');
  const [right, setRight] = useState<RangeValue>('week');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, padding: 24 }}>
      <AbsoluteUIContext.Provider
        value={{ theme: themes.aurora, preferences: defaultPreferences }}
      >
        <Backdrop theme={themes.aurora}>
          <div
            style={{
              color: themes.aurora.colors.textPrimary,
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Default motion
          </div>
          <GlassPicker label="Range" items={rangeItems} value={left} onValueChange={setLeft} />
        </Backdrop>
      </AbsoluteUIContext.Provider>
      <AbsoluteUIContext.Provider
        value={{
          theme: themes.aurora,
          preferences: { ...defaultPreferences, reducedMotion: true },
        }}
      >
        <Backdrop theme={themes.aurora}>
          <div
            style={{
              color: themes.aurora.colors.textPrimary,
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            Reduced Motion · indicator jumps instantly
          </div>
          <GlassPicker label="Range" items={rangeItems} value={right} onValueChange={setRight} />
        </Backdrop>
      </AbsoluteUIContext.Provider>
    </div>
  );
};

export const Keyboard = () => {
  const [range, setRange] = useState<RangeValue>('day');
  return (
    <AbsoluteUIContext.Provider value={{ theme: themes.obsidian, preferences: defaultPreferences }}>
      <Backdrop theme={themes.obsidian}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
          <div style={{ color: themes.obsidian.colors.textSecondary, fontSize: 12 }}>
            Tab to focus any segment, then use Arrow keys to move between options (wraps at either
            end), or Home / End to jump to the first / last enabled option.
          </div>
          <GlassPicker label="Range" items={rangeItems} value={range} onValueChange={setRange} />
        </div>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
};
