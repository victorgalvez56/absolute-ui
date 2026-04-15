import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassButton, GlassModal } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { useState } from 'react';

export default {
  title: 'Primitives / GlassModal',
};

function Demo({ theme }: { theme: Theme }) {
  const [open, setOpen] = useState(false);
  return (
    <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
      <div
        style={{
          position: 'relative',
          padding: 32,
          borderRadius: 20,
          minHeight: 420,
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
        <GlassButton accessibilityLabel="Open the modal" onPress={() => setOpen(true)}>
          Open modal
        </GlassButton>
        <GlassModal
          visible={open}
          onDismiss={() => setOpen(false)}
          title="Delete photo?"
          description="This action cannot be undone. The photo will be removed from all of your devices and from shared albums."
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
      </div>
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
