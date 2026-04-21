import { GlassButton, GlassModal } from '@absolute-ui/core';
import { themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Backdrop, PersonalitiesGrid, ThemedProvider } from './_shared.js';

const meta: Meta<typeof GlassModal> = {
  title: 'Primitives/GlassModal',
  component: GlassModal,
  parameters: {
    docs: {
      description: {
        component:
          'Centered dialog with scrim and focus trap. The scrim mirrors the active theme.',
      },
    },
  },
  argTypes: {
    title: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
  },
  args: {
    title: 'Delete photo?',
    description:
      'This action cannot be undone. The photo will be removed from all of your devices and from shared albums.',
  },
};

export default meta;
type Story = StoryObj<typeof GlassModal>;

function Demo(args: { title?: string; description?: string; themeName?: keyof typeof themes }) {
  const theme = themes[args.themeName ?? 'aurora'];
  const [open, setOpen] = useState(false);
  return (
    <ThemedProvider theme={theme}>
      <Backdrop theme={theme} minHeight={420}>
        <GlassButton accessibilityLabel="Open the modal" onPress={() => setOpen(true)}>
          Open modal
        </GlassButton>
        <GlassModal
          visible={open}
          onDismiss={() => setOpen(false)}
          title={args.title ?? 'Delete photo?'}
          description={args.description}
        >
          <GlassButton
            accessibilityLabel="Cancel and keep the photo"
            onPress={() => setOpen(false)}
          >
            Cancel
          </GlassButton>
          <GlassButton accessibilityLabel="Delete the photo" onPress={() => setOpen(false)}>
            Delete
          </GlassButton>
        </GlassModal>
      </Backdrop>
    </ThemedProvider>
  );
}

export const Playground: Story = {
  render: (args) => <Demo title={args.title} description={args.description} />,
};

function PerPersonalityDemo({ themeName }: { themeName: keyof typeof themes }) {
  return <Demo themeName={themeName} />;
}

export const AllPersonalities: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <PersonalitiesGrid
      minHeight={440}
      minColumnWidth={360}
      render={(theme) => <PerPersonalityDemo themeName={theme.name as keyof typeof themes} />}
    />
  ),
};
