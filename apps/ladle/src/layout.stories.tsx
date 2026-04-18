import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, Box, GlassButton, GlassCard, HStack, VStack } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';

export default {
  title: 'Primitives / Layout',
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

function Tile({ color, children }: { color: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: color,
        borderRadius: 8,
        padding: 12,
        minWidth: 48,
        minHeight: 48,
        color: '#0f1020',
        fontWeight: 600,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

export const Stacks = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
    <Backdrop theme={themes.aurora}>
      <VStack gap="lg" alignItems="flex-start">
        <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>
          HStack — default row, center cross-axis, gap md
        </div>
        <HStack>
          <Tile color="#A6F0E0">A</Tile>
          <Tile color="#A6F0E0">B</Tile>
          <Tile color="#A6F0E0">C</Tile>
        </HStack>
        <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>
          HStack — gap xl, cross-axis flex-start
        </div>
        <HStack gap="xl" alignItems="flex-start">
          <Tile color="#E6C46B">tall</Tile>
          <Tile color="#E6C46B">
            <span style={{ display: 'block', height: 48, lineHeight: '48px' }}>taller</span>
          </Tile>
          <Tile color="#E6C46B">xl gap</Tile>
        </HStack>
        <div style={{ color: themes.aurora.colors.textSecondary, fontSize: 12 }}>
          VStack — default stretch, gap md
        </div>
        <VStack gap="md" style={{ minWidth: 220 }}>
          <Tile color="#8895FF">stretched 1</Tile>
          <Tile color="#8895FF">stretched 2</Tile>
          <Tile color="#8895FF">stretched 3</Tile>
        </VStack>
      </VStack>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);

export const BoxSpacing = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.frost, preferences: defaultPreferences }}>
    <Backdrop theme={themes.frost}>
      <VStack gap="lg" alignItems="flex-start">
        <div style={{ color: themes.frost.colors.textSecondary, fontSize: 12 }}>
          Box — p="lg" px="xl" gap="sm"
        </div>
        <Box
          p="lg"
          px="xl"
          gap="sm"
          backgroundColor="#ffffff55"
          borderRadius={12}
          style={{ flexDirection: 'row' }}
        >
          <Tile color="#A6F0E0">child</Tile>
          <Tile color="#A6F0E0">child</Tile>
          <Tile color="#A6F0E0">child</Tile>
        </Box>
        <div style={{ color: themes.frost.colors.textSecondary, fontSize: 12 }}>
          Composed: VStack of HStacks (form layout)
        </div>
        <GlassCard>
          <GlassCard.Header title="Profile" subtitle="Fill out the required fields" />
          <GlassCard.Body>
            <VStack gap="md">
              <HStack gap="sm">
                <Tile color="#A6F0E0">label</Tile>
                <Tile color="#A6F0E0">input</Tile>
              </HStack>
              <HStack gap="sm">
                <Tile color="#A6F0E0">label</Tile>
                <Tile color="#A6F0E0">input</Tile>
              </HStack>
            </VStack>
          </GlassCard.Body>
          <GlassCard.Footer>
            <HStack justifyContent="flex-end" gap="sm">
              <GlassButton
                action="neutral"
                variant="ghost"
                accessibilityLabel="Cancel"
                onPress={() => {
                  /* noop */
                }}
              >
                Cancel
              </GlassButton>
              <GlassButton
                action="primary"
                variant="solid"
                accessibilityLabel="Save"
                onPress={() => {
                  /* noop */
                }}
              >
                Save
              </GlassButton>
            </HStack>
          </GlassCard.Footer>
        </GlassCard>
      </VStack>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);
