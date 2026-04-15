import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassButton, GlassSheet } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { useState } from 'react';
import { Text } from 'react-native';

export default {
  title: 'Primitives / GlassSheet',
};

function SheetDemo({ theme }: { theme: Theme }) {
  const [open, setOpen] = useState(false);
  return (
    <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
      <div
        style={{
          position: 'relative',
          padding: 32,
          borderRadius: 20,
          minHeight: 440,
          background: theme.dark
            ? 'radial-gradient(1200px at 20% 10%, #7a5cff 0%, #0f1020 60%)'
            : 'radial-gradient(1200px at 20% 10%, #ffc36b 0%, #f6eede 60%)',
          overflow: 'hidden',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
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
        <GlassButton accessibilityLabel="Open the sheet" onPress={() => setOpen(true)}>
          Open sheet
        </GlassButton>
        <GlassSheet visible={open} onDismiss={() => setOpen(false)} title="Share post">
          <Text style={{ color: theme.colors.textPrimary, fontSize: 14, marginBottom: 16 }}>
            Choose who can see this. The sheet dismisses when you tap the scrim outside the card or
            press the Cancel button.
          </Text>
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            <GlassButton accessibilityLabel="Share to everyone" onPress={() => setOpen(false)}>
              Everyone
            </GlassButton>
            <GlassButton accessibilityLabel="Share to friends only" onPress={() => setOpen(false)}>
              Friends only
            </GlassButton>
            <GlassButton accessibilityLabel="Cancel" onPress={() => setOpen(false)}>
              Cancel
            </GlassButton>
          </div>
        </GlassSheet>
      </div>
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
      <SheetDemo key={theme.name} theme={theme} />
    ))}
  </div>
);
