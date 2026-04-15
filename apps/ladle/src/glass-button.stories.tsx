import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassButton } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';

export default {
  title: 'Primitives / GlassButton',
};

function Backdrop({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 32,
        borderRadius: 20,
        minHeight: 220,
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
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}
        >
          <GlassButton
            accessibilityLabel="Primary action"
            onPress={() => {
              /* noop */
            }}
          >
            Continue
          </GlassButton>
          <GlassButton
            accessibilityLabel="Disabled action"
            disabled
            onPress={() => {
              /* noop */
            }}
          >
            Disabled
          </GlassButton>
          <GlassButton
            accessibilityLabel="Secondary action at elevation 2"
            elevation={2}
            radius="md"
            onPress={() => {
              /* noop */
            }}
          >
            Learn more
          </GlassButton>
        </div>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
}

export const AllPersonalities = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(300px, 1fr))',
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, auto)',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>idle</div>
        <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>disabled</div>
        <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>elevation 3</div>
        <GlassButton
          accessibilityLabel="Idle button"
          onPress={() => {
            /* noop */
          }}
        >
          Ship it
        </GlassButton>
        <GlassButton accessibilityLabel="Disabled button" disabled>
          Ship it
        </GlassButton>
        <GlassButton
          accessibilityLabel="High elevation button"
          elevation={3}
          onPress={() => {
            /* noop */
          }}
        >
          Ship it
        </GlassButton>
      </div>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);
