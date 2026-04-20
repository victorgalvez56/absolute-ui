import {
  GlassButton,
  GlassCard,
  GlassNavBar,
  GlassPicker,
  type GlassPickerItem,
  GlassSlider,
  GlassSurface,
} from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PhoneFrame, PhoneStage } from './screens/phone-frame.js';

const meta: Meta = {
  title: 'Screens/Now Playing',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Media player with artwork, scrubber, transport controls, and a segmented Queue / Lyrics / Devices picker.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

type QueueTab = 'queue' | 'lyrics' | 'devices';

const queueItems: readonly GlassPickerItem<QueueTab>[] = [
  { value: 'queue', label: 'Queue' },
  { value: 'lyrics', label: 'Lyrics' },
  { value: 'devices', label: 'Devices' },
];

function PlayerScreen({ theme }: { theme: Theme }) {
  const [position, setPosition] = useState(78);
  const [volume, setVolume] = useState(55);
  const [tab, setTab] = useState<QueueTab>('queue');
  const [playing, setPlaying] = useState(true);
  const duration = 224;

  return (
    <PhoneFrame theme={theme}>
      <GlassNavBar
        title="Now Playing"
        leading={<NavGlyph label="Close" glyph="⌄" />}
        trailing={<NavGlyph label="More" glyph="•••" />}
      />
      <div
        style={{
          flex: 1,
          padding: '24px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          overflow: 'auto',
        }}
      >
        <Artwork theme={theme} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.textPrimary }}>
            Liquid Horizon
          </div>
          <div style={{ fontSize: 14, color: theme.colors.textSecondary }}>
            Atlas Weaver · Nocturne
          </div>
        </div>

        <div>
          <GlassSlider
            value={position}
            onValueChange={setPosition}
            minimumValue={0}
            maximumValue={duration}
            step={1}
            accessibilityLabel="Playback position"
          />
          <div
            style={{
              marginTop: 6,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              fontVariantNumeric: 'tabular-nums',
              color: theme.colors.textSecondary,
            }}
          >
            <span>{formatTime(position)}</span>
            <span>-{formatTime(duration - position)}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          <GlassButton
            accessibilityLabel="Previous track"
            elevation={0}
            radius="pill"
            onPress={() => setPosition(0)}
          >
            ⏮
          </GlassButton>
          <GlassButton
            accessibilityLabel={playing ? 'Pause' : 'Play'}
            elevation={3}
            radius="pill"
            onPress={() => setPlaying((p) => !p)}
            style={{ minWidth: 92 }}
          >
            <span style={{ fontSize: 22 }}>{playing ? '⏸' : '▶'}</span>
          </GlassButton>
          <GlassButton
            accessibilityLabel="Next track"
            elevation={0}
            radius="pill"
            onPress={() => setPosition(duration)}
          >
            ⏭
          </GlassButton>
        </div>

        <GlassSlider
          label="Volume"
          value={volume}
          onValueChange={setVolume}
          formatValue={(v) => `${v}%`}
        />

        <GlassCard elevation={2}>
          <GlassCard.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <GlassPicker items={queueItems} value={tab} onValueChange={setTab} />
              {tab === 'queue' ? (
                <QueueList theme={theme} />
              ) : tab === 'lyrics' ? (
                <Lyrics theme={theme} />
              ) : (
                <Devices theme={theme} />
              )}
            </div>
          </GlassCard.Body>
        </GlassCard>
      </div>
    </PhoneFrame>
  );
}

function Artwork({ theme }: { theme: Theme }) {
  return (
    <GlassSurface
      elevation={3}
      radius="xl"
      style={{
        aspectRatio: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
      accessibilityLabel="Album artwork for Liquid Horizon"
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 90% at 30% 20%, ${theme.colors.accent}, transparent 55%), radial-gradient(100% 100% at 80% 80%, ${theme.colors.focusRing}, transparent 60%)`,
          opacity: theme.dark ? 0.55 : 0.8,
        }}
      />
      <span
        style={{
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -2,
          color: theme.colors.onAccent,
          mixBlendMode: 'screen',
        }}
      >
        AW
      </span>
    </GlassSurface>
  );
}

function QueueList({ theme }: { theme: Theme }) {
  const tracks = [
    { title: 'Liquid Horizon', artist: 'Atlas Weaver', length: '3:44', current: true },
    { title: 'Coral Drift', artist: 'Atlas Weaver', length: '4:02' },
    { title: 'Starless Roads', artist: 'Meridia', length: '5:18' },
    { title: 'Low Current', artist: 'Wavemaker', length: '3:12' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {tracks.map((track) => (
        <div
          key={track.title}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            padding: '8px 4px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: track.current ? 700 : 500,
                color: track.current ? theme.colors.accent : theme.colors.textPrimary,
              }}
            >
              {track.title}
            </span>
            <span style={{ fontSize: 12, color: theme.colors.textSecondary }}>{track.artist}</span>
          </div>
          <span
            style={{
              fontSize: 12,
              fontVariantNumeric: 'tabular-nums',
              color: theme.colors.textSecondary,
            }}
          >
            {track.length}
          </span>
        </div>
      ))}
    </div>
  );
}

function Lyrics({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        fontSize: 14,
        lineHeight: 1.4,
        color: theme.colors.textSecondary,
      }}
    >
      <div style={{ color: theme.colors.textPrimary, fontWeight: 600 }}>
        And the skyline dissolves into tides,
      </div>
      <div style={{ color: theme.colors.accent, fontWeight: 600 }}>
        A horizon made entirely of glass —
      </div>
      <div>Every window a wave we can hold.</div>
      <div>Every step, a refraction in the dark.</div>
    </div>
  );
}

function Devices({ theme }: { theme: Theme }) {
  const devices = [
    { label: 'This iPhone', status: 'Connected', active: true },
    { label: 'Living Room HomePod', status: 'Available', active: false },
    { label: 'AirPods Pro', status: 'Offline', active: false },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {devices.map((d) => (
        <div
          key={d.label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 14,
            color: d.active ? theme.colors.accent : theme.colors.textPrimary,
            fontWeight: d.active ? 700 : 500,
          }}
        >
          <span>{d.label}</span>
          <span style={{ fontSize: 12, color: theme.colors.textSecondary }}>{d.status}</span>
        </div>
      ))}
    </div>
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
      <span style={{ fontSize: 14, fontWeight: 700 }}>{glyph}</span>
    </GlassSurface>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export const Aurora: Story = {
  render: () => (
    <PhoneStage>
      <PlayerScreen theme={themes.aurora} />
    </PhoneStage>
  ),
};

export const Obsidian: Story = {
  render: () => (
    <PhoneStage>
      <PlayerScreen theme={themes.obsidian} />
    </PhoneStage>
  ),
};

export const Frost: Story = {
  render: () => (
    <PhoneStage>
      <PlayerScreen theme={themes.frost} />
    </PhoneStage>
  ),
};

export const Sunset: Story = {
  render: () => (
    <PhoneStage>
      <PlayerScreen theme={themes.sunset} />
    </PhoneStage>
  ),
};

export const AllPersonalities: Story = {
  render: () => (
    <PhoneStage>
      {Object.values(themes).map((theme) => (
        <PlayerScreen key={theme.name} theme={theme} />
      ))}
    </PhoneStage>
  ),
};
