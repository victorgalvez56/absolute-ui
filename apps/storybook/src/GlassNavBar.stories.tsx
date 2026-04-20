import { GlassButton, GlassNavBar } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassNavBar> = {
  title: 'Primitives/GlassNavBar',
  component: GlassNavBar,
  parameters: {
    docs: {
      description: {
        component:
          'Top navigation bar. Blurs content underneath and keeps the title optically centered even with leading / trailing slots.',
      },
    },
  },
  argTypes: {
    title: { control: { type: 'text' } },
  },
  args: {
    title: 'Settings',
  },
};

export default meta;
type Story = StoryObj<typeof GlassNavBar>;

export const Playground: Story = {
  render: (args) => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={260}>
        <GlassNavBar
          title={args.title ?? 'Settings'}
          leading={
            <GlassButton
              accessibilityLabel="Back"
              radius="pill"
              onPress={action('back')}
              style={{ minWidth: 44 }}
            >
              Back
            </GlassButton>
          }
          trailing={
            <GlassButton
              accessibilityLabel="Edit"
              radius="pill"
              onPress={action('edit')}
              style={{ minWidth: 44 }}
            >
              Edit
            </GlassButton>
          }
        />
        <div
          style={{ padding: 16, color: themes.aurora.colors.textSecondary, fontSize: 13 }}
        >
          Content below the bar.
        </div>
      </Backdrop>
    </ThemedProvider>
  ),
};

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid
      minHeight={260}
      minColumnWidth={360}
      render={(theme) => (
        <>
          <GlassNavBar
            title="Settings"
            leading={
              <GlassButton
                accessibilityLabel="Back"
                radius="pill"
                onPress={action('back')}
                style={{ minWidth: 44 }}
              >
                Back
              </GlassButton>
            }
            trailing={
              <GlassButton
                accessibilityLabel="Edit"
                radius="pill"
                onPress={action('edit')}
                style={{ minWidth: 44 }}
              >
                Edit
              </GlassButton>
            }
          />
          <div style={{ padding: 16, color: theme.colors.textSecondary, fontSize: 13 }}>
            {theme.label} · content below the bar
          </div>
        </>
      )}
    />
  ),
};

export const TitleOnly: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <ThemedProvider theme={themes.aurora}>
      <Backdrop theme={themes.aurora} minHeight={220}>
        <GlassNavBar title="Profile" />
        <div style={{ padding: 16, color: themes.aurora.colors.textSecondary, fontSize: 13 }}>
          No leading or trailing slots — the title spans the full width but stays centered.
        </div>
      </Backdrop>
    </ThemedProvider>
  ),
};
