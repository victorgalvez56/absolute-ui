import { defaultPreferences } from '@absolute-ui/a11y';
import {
  AbsoluteUIContext,
  type GlassButtonAction,
  type GlassButtonSize,
  type GlassButtonVariant,
  GlassButton,
  HStack,
  VStack,
} from '@absolute-ui/core';
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

/* ---------- New: variant × action matrix ---------- */

const VARIANTS: GlassButtonVariant[] = ['solid', 'soft', 'outline', 'ghost', 'link'];
const ACTIONS: GlassButtonAction[] = ['primary', 'neutral', 'danger'];

function SectionLabel({ theme, text }: { theme: Theme; text: string }) {
  return (
    <div
      style={{
        color: theme.colors.textSecondary,
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      {text}
    </div>
  );
}

export const VariantMatrix = () => (
  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
    {Object.values(themes).map((theme) => (
      <AbsoluteUIContext.Provider
        key={theme.name}
        value={{ theme, preferences: defaultPreferences }}
      >
        <Backdrop theme={theme}>
          <div style={{ color: theme.colors.textPrimary, fontWeight: 700, marginBottom: 12 }}>
            {theme.label}
          </div>
          {ACTIONS.map((action) => (
            <div key={action} style={{ marginBottom: 16 }}>
              <SectionLabel theme={theme} text={`action: ${action}`} />
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  alignItems: 'center',
                  marginTop: 6,
                }}
              >
                {VARIANTS.map((variant) => (
                  <GlassButton
                    key={variant}
                    action={action}
                    variant={variant}
                    accessibilityLabel={`${action} ${variant}`}
                    onPress={() => {
                      /* noop */
                    }}
                  >
                    {variant}
                  </GlassButton>
                ))}
              </div>
            </div>
          ))}
        </Backdrop>
      </AbsoluteUIContext.Provider>
    ))}
  </div>
);

/* ---------- Sizes ---------- */

const SIZES: GlassButtonSize[] = ['sm', 'md', 'lg'];

export const Sizes = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
    <Backdrop theme={themes.aurora}>
      <VStack gap="lg" alignItems="flex-start">
        {SIZES.map((size) => (
          <HStack key={size} gap="md">
            <div
              style={{
                color: themes.aurora.colors.textSecondary,
                fontSize: 12,
                minWidth: 24,
              }}
            >
              {size}
            </div>
            <GlassButton
              size={size}
              action="primary"
              variant="solid"
              accessibilityLabel={`Primary ${size}`}
              onPress={() => {
                /* noop */
              }}
            >
              Continue
            </GlassButton>
            <GlassButton
              size={size}
              action="neutral"
              variant="outline"
              accessibilityLabel={`Outline ${size}`}
              onPress={() => {
                /* noop */
              }}
            >
              Cancel
            </GlassButton>
            <GlassButton
              size={size}
              action="primary"
              variant="ghost"
              accessibilityLabel={`Ghost ${size}`}
              onPress={() => {
                /* noop */
              }}
            >
              Skip
            </GlassButton>
          </HStack>
        ))}
      </VStack>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);

/* ---------- Compound slots: Icon + Text + Spinner ---------- */

const ArrowGlyph = ({ color }: { color: string }) => (
  <span
    aria-hidden="true"
    style={{ color, fontSize: 16, fontWeight: 700, lineHeight: 1, display: 'inline-block' }}
  >
    →
  </span>
);

const PlusGlyph = ({ color }: { color: string }) => (
  <span
    aria-hidden="true"
    style={{ color, fontSize: 18, fontWeight: 700, lineHeight: 1, display: 'inline-block' }}
  >
    +
  </span>
);

export const SlotsAndLoading = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.obsidian, preferences: defaultPreferences }}>
    <Backdrop theme={themes.obsidian}>
      <VStack gap="lg" alignItems="flex-start">
        <SectionLabel theme={themes.obsidian} text="leading icon" />
        <HStack gap="md">
          <GlassButton
            action="primary"
            variant="solid"
            accessibilityLabel="Create new"
            onPress={() => {
              /* noop */
            }}
          >
            <GlassButton.Icon>
              <PlusGlyph color={themes.obsidian.colors.onAccent} />
            </GlassButton.Icon>
            <GlassButton.Text>New project</GlassButton.Text>
          </GlassButton>
          <GlassButton
            action="primary"
            variant="outline"
            accessibilityLabel="Continue"
            onPress={() => {
              /* noop */
            }}
          >
            <GlassButton.Text>Continue</GlassButton.Text>
            <GlassButton.Icon>
              <ArrowGlyph color={themes.obsidian.colors.accent} />
            </GlassButton.Icon>
          </GlassButton>
        </HStack>

        <SectionLabel theme={themes.obsidian} text="loading" />
        <HStack gap="md">
          <GlassButton action="primary" variant="solid" loading accessibilityLabel="Saving">
            <GlassButton.Spinner />
            <GlassButton.Text>Saving…</GlassButton.Text>
          </GlassButton>
          <GlassButton action="danger" variant="solid" loading accessibilityLabel="Deleting">
            <GlassButton.Spinner />
            <GlassButton.Text>Deleting</GlassButton.Text>
          </GlassButton>
          <GlassButton action="neutral" variant="ghost" loading accessibilityLabel="Working">
            <GlassButton.Spinner />
          </GlassButton>
        </HStack>

        <SectionLabel theme={themes.obsidian} text="danger action" />
        <HStack gap="md">
          <GlassButton
            action="danger"
            variant="solid"
            accessibilityLabel="Delete account"
            onPress={() => {
              /* noop */
            }}
          >
            Delete account
          </GlassButton>
          <GlassButton
            action="danger"
            variant="outline"
            accessibilityLabel="Discard"
            onPress={() => {
              /* noop */
            }}
          >
            Discard
          </GlassButton>
          <GlassButton
            action="danger"
            variant="ghost"
            accessibilityLabel="Reset"
            onPress={() => {
              /* noop */
            }}
          >
            Reset
          </GlassButton>
        </HStack>
      </VStack>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);
