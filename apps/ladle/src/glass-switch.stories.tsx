import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassSwitch } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { useState } from 'react';

export default {
  title: 'Primitives / GlassSwitch',
};

function Backdrop({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 32,
        borderRadius: 20,
        minHeight: 260,
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
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
          <GlassSwitch label="Wi-Fi" value={wifi} onValueChange={setWifi} />
          <GlassSwitch label="Bluetooth" value={bluetooth} onValueChange={setBluetooth} />
          <GlassSwitch label="Airplane mode" defaultValue={false} onValueChange={() => {}} />
          <GlassSwitch label="Hotspot (disabled)" defaultValue={true} disabled />
        </div>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
}

export const AllPersonalities = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(320px, 1fr))',
      gap: 24,
      padding: 24,
    }}
  >
    {Object.values(themes).map((theme) => (
      <Swatch key={theme.name} theme={theme} />
    ))}
  </div>
);

export const States = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
    <Backdrop theme={themes.aurora}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
        <GlassSwitch label="Off" defaultValue={false} onValueChange={() => {}} />
        <GlassSwitch label="On" defaultValue={true} onValueChange={() => {}} />
        <GlassSwitch label="Disabled (off)" defaultValue={false} disabled />
        <GlassSwitch label="Disabled (on)" defaultValue={true} disabled />
        <GlassSwitch label="Decorative (no handler)" defaultValue={true} />
      </div>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);

export const SettingsRow = () => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [airplane, setAirplane] = useState(false);
  const [cellular, setCellular] = useState(true);
  return (
    <AbsoluteUIContext.Provider value={{ theme: themes.obsidian, preferences: defaultPreferences }}>
      <Backdrop theme={themes.obsidian}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
          <div style={{ color: themes.obsidian.colors.textSecondary, fontSize: 12 }}>
            Settings-row composition — every row is a single Pressable so tapping the label toggles
            the switch.
          </div>
          <GlassSwitch label="Wi-Fi" value={wifi} onValueChange={setWifi} />
          <GlassSwitch label="Bluetooth" value={bluetooth} onValueChange={setBluetooth} />
          <GlassSwitch label="Airplane mode" value={airplane} onValueChange={setAirplane} />
          <GlassSwitch label="Cellular data" value={cellular} onValueChange={setCellular} />
        </div>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
};
