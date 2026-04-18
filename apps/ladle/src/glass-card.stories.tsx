import { defaultPreferences } from '@absolute-ui/a11y';
import {
  AbsoluteUIContext,
  GlassButton,
  GlassCard,
  type GlassCardAction,
  type GlassCardVariant,
  HStack,
  VStack,
} from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { Text } from 'react-native';

export default {
  title: 'Primitives / GlassCard',
};

function Backdrop({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 32,
        borderRadius: 20,
        minHeight: 340,
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
        <GlassCard elevation={2} radius="lg">
          <GlassCard.Header
            title="Upgrade available"
            subtitle="Absolute UI 0.1.0 ships the new liquid glass primitives."
          />
          <GlassCard.Divider />
          <GlassCard.Body>
            <Text style={{ color: theme.colors.textPrimary, fontSize: 14, lineHeight: 20 }}>
              The release includes four personalities, an APCA-aware contrast check on every glass
              recipe, and a compound GlassCard API.
            </Text>
          </GlassCard.Body>
          <GlassCard.Footer>
            <GlassButton accessibilityLabel="Dismiss" onPress={() => {}}>
              Dismiss
            </GlassButton>
            <GlassButton accessibilityLabel="Install the update" onPress={() => {}} elevation={2}>
              Install
            </GlassButton>
          </GlassCard.Footer>
        </GlassCard>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
}

export const AllPersonalities = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(380px, 1fr))',
      gap: 24,
      padding: 24,
    }}
  >
    {Object.values(themes).map((theme) => (
      <Swatch key={theme.name} theme={theme} />
    ))}
  </div>
);

export const WithTrailing = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
    <Backdrop theme={themes.aurora}>
      <GlassCard>
        <GlassCard.Header
          title="Notifications"
          subtitle="3 unread"
          trailing={
            <GlassButton accessibilityLabel="Mark all as read" onPress={() => {}} radius="pill">
              Mark read
            </GlassButton>
          }
        />
        <GlassCard.Divider />
        <GlassCard.Body>
          <Text style={{ color: themes.aurora.colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
            The trailing slot accepts any ReactNode. In this example it's a GlassButton, but it
            could be an icon, a badge, or a menu trigger.
          </Text>
        </GlassCard.Body>
      </GlassCard>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);

/* ---------- New: variants × actions ---------- */

const CARD_VARIANTS: GlassCardVariant[] = ['filled', 'soft', 'outline', 'ghost'];
const CARD_ACTIONS: GlassCardAction[] = ['neutral', 'primary', 'danger'];

export const VariantMatrix = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.obsidian, preferences: defaultPreferences }}>
    <Backdrop theme={themes.obsidian}>
      <VStack gap="lg" alignItems="stretch">
        {CARD_ACTIONS.map((action) => (
          <VStack key={action} gap="sm">
            <Text
              style={{
                color: themes.obsidian.colors.textSecondary,
                fontSize: 11,
                fontWeight: '600',
              }}
            >
              {`action: ${action}`.toUpperCase()}
            </Text>
            <HStack gap="md" alignItems="stretch">
              {CARD_VARIANTS.map((variant) => (
                <GlassCard
                  key={variant}
                  variant={variant}
                  action={action}
                  style={{ flex: 1, minWidth: 180 }}
                >
                  <GlassCard.Header title={variant} subtitle={`action: ${action}`} />
                  <GlassCard.Body>
                    <Text style={{ color: themes.obsidian.colors.textSecondary, fontSize: 13 }}>
                      Short body copy.
                    </Text>
                  </GlassCard.Body>
                </GlassCard>
              ))}
            </HStack>
          </VStack>
        ))}
      </VStack>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);

/* ---------- Sizes ---------- */

export const Sizes = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.frost, preferences: defaultPreferences }}>
    <Backdrop theme={themes.frost}>
      <HStack gap="md" alignItems="flex-start">
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <GlassCard key={size} size={size} style={{ flex: 1 }}>
            <GlassCard.Header title={`Card ${size}`} subtitle="Shared body copy" />
            <GlassCard.Divider />
            <GlassCard.Body>
              <Text style={{ color: themes.frost.colors.textSecondary, fontSize: 13 }}>
                Padding + title scale with the size token.
              </Text>
            </GlassCard.Body>
            <GlassCard.Footer>
              <GlassButton
                size={size}
                action="primary"
                variant="solid"
                accessibilityLabel={`Confirm ${size}`}
                onPress={() => {}}
              >
                Confirm
              </GlassButton>
            </GlassCard.Footer>
          </GlassCard>
        ))}
      </HStack>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);
