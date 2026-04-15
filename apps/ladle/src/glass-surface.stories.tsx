import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassSurface } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';

export default {
  title: 'Primitives / GlassSurface',
};

/**
 * A photographic backdrop so the real blur effect of GlassSurface is
 * visible. The same gradient is reused for every personality so the
 * only thing that changes between swatches is the glass recipe.
 */
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
  return (
    <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
      <Backdrop theme={theme}>
        <div
          style={{
            color: theme.colors.textPrimary,
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          {theme.label}
        </div>
        <GlassSurface
          elevation={2}
          radius="lg"
          style={{
            padding: 20,
            minHeight: 120,
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: theme.colors.textPrimary,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            Liquid Glass
          </span>
          <span
            style={{
              color: theme.colors.textSecondary,
              fontSize: 13,
              marginTop: 4,
            }}
          >
            elevation 2 · radius lg
          </span>
        </GlassSurface>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
}

export const AllPersonalities = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))',
      gap: 24,
      padding: 24,
    }}
  >
    {Object.values(themes).map((theme) => (
      <Swatch key={theme.name} theme={theme} />
    ))}
  </div>
);

export const Elevations = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
    <Backdrop theme={themes.aurora}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        {[0, 1, 2, 3].map((e) => (
          <GlassSurface
            key={e}
            elevation={e as 0 | 1 | 2 | 3}
            style={{ padding: 16, minHeight: 100 }}
          >
            <span
              style={{
                color: themes.aurora.colors.textPrimary,
                fontSize: 13,
              }}
            >
              elevation {e}
            </span>
          </GlassSurface>
        ))}
      </div>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);
