import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassTabBar } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { useState } from 'react';
import { Text } from 'react-native';

export default {
  title: 'Primitives / GlassTabBar',
};

function Backdrop({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 16,
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

const ITEMS = [
  { key: 'home', label: 'Home', leading: <Text>🏠</Text> },
  { key: 'search', label: 'Search', leading: <Text>🔍</Text> },
  { key: 'library', label: 'Library', leading: <Text>📚</Text> },
  { key: 'profile', label: 'Profile', leading: <Text>👤</Text> },
];

function Demo({ theme }: { theme: Theme }) {
  const [activeKey, setActiveKey] = useState('home');
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
          {theme.label} · active: {activeKey}
        </div>
        <GlassTabBar items={ITEMS} activeKey={activeKey} onTabPress={setActiveKey} />
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
      <Demo key={theme.name} theme={theme} />
    ))}
  </div>
);
