import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassButton, GlassNavBar } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';

export default {
  title: 'Primitives / GlassNavBar',
};

function Backdrop({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 0,
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
  return (
    <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
      <Backdrop theme={theme}>
        <GlassNavBar
          title="Settings"
          leading={
            <GlassButton
              accessibilityLabel="Back"
              radius="pill"
              onPress={() => {}}
              style={{ minWidth: 44 }}
            >
              Back
            </GlassButton>
          }
          trailing={
            <GlassButton
              accessibilityLabel="Edit"
              radius="pill"
              onPress={() => {}}
              style={{ minWidth: 44 }}
            >
              Edit
            </GlassButton>
          }
        />
        <div
          style={{
            padding: 16,
            color: theme.colors.textSecondary,
            fontSize: 13,
          }}
        >
          {theme.label} · content below the bar
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

export const TitleOnly = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
    <Backdrop theme={themes.aurora}>
      <GlassNavBar title="Profile" />
      <div style={{ padding: 16, color: themes.aurora.colors.textSecondary, fontSize: 13 }}>
        No leading or trailing slots — the title spans the full width but stays centered.
      </div>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);
