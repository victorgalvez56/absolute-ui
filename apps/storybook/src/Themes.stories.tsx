import { apcaContrast } from '@absolute-ui/a11y';
import { type Theme, themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Tokens/Themes',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The four personalities shipped with Absolute UI. Each swatch renders the level-2 glass recipe on top of the theme background and reports the APCA Lc between primary text and the surface.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ThemeSwatch({ theme }: { theme: Theme }) {
  const recipe = theme.glass[2];
  const lc = apcaContrast(theme.colors.textPrimary, theme.colors.background);

  return (
    <div
      style={{
        background: theme.colors.background,
        color: theme.colors.textPrimary,
        padding: 24,
        borderRadius: 16,
        border: `1px solid ${theme.colors.divider}`,
        fontFamily: 'system-ui, sans-serif',
        minHeight: 220,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 12,
          background: recipe.tint,
          borderRadius: 12,
          border: `${recipe.borderWidth}px solid ${recipe.borderColor}`,
          backdropFilter: `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`,
          WebkitBackdropFilter: `blur(${recipe.blurRadius}px) saturate(${recipe.saturation})`,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <strong style={{ fontSize: 18 }}>{theme.label}</strong>
        <span style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
          {theme.dark ? 'dark' : 'light'} · motion: {theme.motion.surface}
        </span>
        <span style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
          APCA Lc {lc.toFixed(1)} · elevation 2 blur {recipe.blurRadius}
        </span>
      </div>
    </div>
  );
}

export const AllPersonalities: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(240px, 1fr))',
        gap: 16,
      }}
    >
      {Object.values(themes).map((theme) => (
        <ThemeSwatch key={theme.name} theme={theme} />
      ))}
    </div>
  ),
};
