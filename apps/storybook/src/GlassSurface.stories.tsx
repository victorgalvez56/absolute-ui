import { GlassSurface } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassSurface> = {
  title: 'Primitives/GlassSurface',
  component: GlassSurface,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Base liquid-glass primitive every other component composes. Elevation selects the glass recipe; radius picks the corner token.',
      },
    },
  },
  argTypes: {
    elevation: {
      control: { type: 'inline-radio' },
      options: [0, 1, 2, 3],
      description: 'Glass recipe. Higher = more blur, saturation, and tint.',
    },
    radius: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', 'pill'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassSurface>;

export const Playground: Story = {
  args: {
    elevation: 2,
    radius: 'lg',
  },
  render: (args) => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={240}>
        <GlassSurface
          {...args}
          style={{ padding: 24, minHeight: 140, justifyContent: 'center' }}
        >
          <span
            style={{
              color: themes.aurora.colors.textPrimary,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Liquid Glass
          </span>
          <span
            style={{
              color: themes.aurora.colors.textSecondary,
              fontSize: 13,
              marginTop: 4,
            }}
          >
            elevation {args.elevation ?? 1} · radius {args.radius ?? 'md'}
          </span>
        </GlassSurface>
      </Backdrop>
    </ThemedProvider>
  ),
};

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid
      minHeight={260}
      render={(theme) => (
        <GlassSurface
          elevation={2}
          radius="lg"
          style={{ padding: 20, minHeight: 120, justifyContent: 'center' }}
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
      )}
    />
  ),
};

export const Elevations: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ThemedProvider theme={themes.aurora}>
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
    </ThemedProvider>
  ),
};
