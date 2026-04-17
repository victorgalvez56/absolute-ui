import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassSlider } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { useState } from 'react';

export default {
  title: 'Primitives / GlassSlider',
};

function Backdrop({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 32,
        borderRadius: 20,
        minHeight: 320,
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
  const [volume, setVolume] = useState(62);
  const [brightness, setBrightness] = useState(40);
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
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
}

export const AllPersonalities = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(360px, 1fr))',
      gap: 24,
      padding: 24,
    }}
  >
    {Object.values(themes).map((theme) => (
      <Swatch key={theme.name} theme={theme} />
    ))}
  </div>
);

export const Keyboard = () => {
  const [value, setValue] = useState(50);
  return (
    <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
      <Backdrop theme={themes.aurora}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
          <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>
            Tab to focus the slider, then use Arrow keys, Home/End, or PageUp/PageDown to adjust.
            The value updates synchronously so keyboard users never lose the thumb position between
            keystrokes.
          </div>
          <GlassSlider
            label="Keyboard-adjustable"
            value={value}
            onValueChange={setValue}
            step={2}
            formatValue={(v) => `${v}`}
          />
        </div>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
};

export const Ranges = () => {
  const [zoom, setZoom] = useState(1);
  const [temperature, setTemperature] = useState(72);
  const [rating, setRating] = useState(3);
  return (
    <AbsoluteUIContext.Provider value={{ theme: themes.obsidian, preferences: defaultPreferences }}>
      <Backdrop theme={themes.obsidian}>
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
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
};
