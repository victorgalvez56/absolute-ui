import {
  GlassCard,
  GlassNavBar,
  GlassPicker,
  type GlassPickerItem,
  GlassSlider,
  GlassSurface,
  GlassSwitch,
  GlassTabBar,
} from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PhoneFrame, PhoneStage } from './screens/phone-frame.js';

const meta: Meta = {
  title: 'Screens/Settings',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Grouped rows with switches, pickers, and sliders, anchored by a bottom tab bar. Exercises the full input surface.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

type DensityValue = 'compact' | 'cozy' | 'comfortable';
const densityItems: readonly GlassPickerItem<DensityValue>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'comfortable', label: 'Comfortable' },
];

type AppearanceValue = 'system' | 'light' | 'dark';
const appearanceItems: readonly GlassPickerItem<AppearanceValue>[] = [
  { value: 'system', label: 'Auto' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

function SettingsScreen({ theme }: { theme: Theme }) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [airplane, setAirplane] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [appearance, setAppearance] = useState<AppearanceValue>('system');
  const [density, setDensity] = useState<DensityValue>('cozy');
  const [brightness, setBrightness] = useState(62);
  const [textSize, setTextSize] = useState(100);
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <PhoneFrame theme={theme}>
      <GlassNavBar
        title="Settings"
        leading={<NavGlyph label="Back" glyph="‹" />}
        trailing={<NavGlyph label="Done" glyph="✓" />}
      />
      <div
        style={{
          flex: 1,
          padding: '20px 16px 88px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          overflow: 'auto',
        }}
      >
        <GlassCard elevation={1}>
          <GlassCard.Header title="Connectivity" subtitle="Network and radio controls" />
          <GlassCard.Divider />
          <GlassCard.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <GlassSwitch label="Wi-Fi" value={wifi} onValueChange={setWifi} />
              <GlassSwitch label="Bluetooth" value={bluetooth} onValueChange={setBluetooth} />
              <GlassSwitch label="Airplane mode" value={airplane} onValueChange={setAirplane} />
            </div>
          </GlassCard.Body>
        </GlassCard>

        <GlassCard elevation={1}>
          <GlassCard.Header title="Display" />
          <GlassCard.Divider />
          <GlassCard.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <GlassPicker
                label="Appearance"
                items={appearanceItems}
                value={appearance}
                onValueChange={setAppearance}
              />
              <GlassPicker
                label="Row density"
                items={densityItems}
                value={density}
                onValueChange={setDensity}
              />
              <GlassSlider
                label="Brightness"
                value={brightness}
                onValueChange={setBrightness}
                formatValue={(v) => `${v}%`}
              />
              <GlassSlider
                label="Text size"
                value={textSize}
                onValueChange={setTextSize}
                minimumValue={80}
                maximumValue={140}
                step={5}
                formatValue={(v) => `${v}%`}
              />
            </div>
          </GlassCard.Body>
        </GlassCard>

        <GlassCard elevation={1}>
          <GlassCard.Header title="Notifications" />
          <GlassCard.Divider />
          <GlassCard.Body>
            <GlassSwitch
              label="Push notifications"
              value={notifications}
              onValueChange={setNotifications}
            />
          </GlassCard.Body>
        </GlassCard>
      </div>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <GlassTabBar
          items={[
            { key: 'home', label: 'Home', leading: <TabGlyph glyph="􀎟" /> },
            { key: 'search', label: 'Search', leading: <TabGlyph glyph="􀊫" /> },
            { key: 'library', label: 'Library', leading: <TabGlyph glyph="􀫊" /> },
            { key: 'settings', label: 'Settings', leading: <TabGlyph glyph="􀣋" /> },
          ]}
          activeKey={activeTab}
          onTabPress={setActiveTab}
          radius="none"
        />
      </div>
    </PhoneFrame>
  );
}

function NavGlyph({ label, glyph }: { label: string; glyph: string }) {
  return (
    <GlassSurface
      elevation={0}
      radius="pill"
      accessibilityLabel={label}
      style={{
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: 16, fontWeight: 700 }}>{glyph}</span>
    </GlassSurface>
  );
}

function TabGlyph({ glyph }: { glyph: string }) {
  return <span style={{ fontSize: 16 }}>{glyph}</span>;
}

export const Aurora: Story = {
  render: () => (
    <PhoneStage>
      <SettingsScreen theme={themes.aurora} />
    </PhoneStage>
  ),
};

export const Obsidian: Story = {
  render: () => (
    <PhoneStage>
      <SettingsScreen theme={themes.obsidian} />
    </PhoneStage>
  ),
};

export const Frost: Story = {
  render: () => (
    <PhoneStage>
      <SettingsScreen theme={themes.frost} />
    </PhoneStage>
  ),
};

export const Sunset: Story = {
  render: () => (
    <PhoneStage>
      <SettingsScreen theme={themes.sunset} />
    </PhoneStage>
  ),
};

export const AllPersonalities: Story = {
  render: () => (
    <PhoneStage>
      {Object.values(themes).map((theme) => (
        <SettingsScreen key={theme.name} theme={theme} />
      ))}
    </PhoneStage>
  ),
};
