/**
 * Showcase — tours every shipped primitive against the live theme
 * supplied by the parent provider. Stays flat on purpose: one scroll,
 * one section per primitive family, no nested navigation. The
 * example app's job is "does it look/feel right on a real device?",
 * not "demo complex flows" — that's what the Ladle screens are for.
 */
import {
  GlassButton,
  GlassCard,
  GlassInput,
  GlassModal,
  GlassNavBar,
  GlassPicker,
  type GlassPickerItem,
  GlassSheet,
  GlassSlider,
  GlassSurface,
  GlassSwitch,
  GlassTabBar,
  GlassToast,
} from '@absolute-ui/core';
import type { Theme, ThemeName } from '@absolute-ui/tokens';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  theme: Theme;
  onCycleTheme: () => void;
};

type TabKey = 'components' | 'themes' | 'about';

type DensityValue = 'compact' | 'cozy' | 'comfortable';

const densityItems: readonly GlassPickerItem<DensityValue>[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'cozy', label: 'Cozy' },
  { value: 'comfortable', label: 'Comfortable' },
];

export function ShowcaseScreen({ theme, onCycleTheme }: Props) {
  const insets = useSafeAreaInsets();

  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [volume, setVolume] = useState(55);
  const [density, setDensity] = useState<DensityValue>('cozy');
  const [email, setEmail] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('components');

  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const styles = useMemo(() => buildStyles(theme), [theme]);

  const showToast = useCallback(() => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2400);
  }, []);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <GlassNavBar
        title="Absolute UI"
        trailing={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Cycle theme. Current: ${theme.label}`}
            onPress={onCycleTheme}
            style={styles.themeCycle}
          >
            <Text style={styles.themeCycleText}>{theme.label}</Text>
          </Pressable>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 96 }]}
      >
        <Section title="Surfaces" subtitle="Four elevations composite against the same backdrop.">
          <View style={styles.surfaceRow}>
            {[0, 1, 2, 3].map((elevation) => (
              <GlassSurface
                key={elevation}
                elevation={elevation as 0 | 1 | 2 | 3}
                radius="lg"
                style={styles.surfaceTile}
              >
                <Text style={styles.surfaceLabel}>E{elevation}</Text>
              </GlassSurface>
            ))}
          </View>
        </Section>

        <Section title="Buttons">
          <View style={styles.buttonRow}>
            <GlassButton accessibilityLabel="Primary action" onPress={() => {}}>
              Primary
            </GlassButton>
            <GlassButton accessibilityLabel="Disabled" disabled onPress={() => {}}>
              Disabled
            </GlassButton>
            <GlassButton
              accessibilityLabel="Elevation 2"
              elevation={2}
              radius="md"
              onPress={() => {}}
            >
              Elevated
            </GlassButton>
          </View>
        </Section>

        <Section title="Card">
          <GlassCard elevation={2}>
            <GlassCard.Header
              title="Account"
              subtitle="Private information stays on this device."
            />
            <GlassCard.Divider />
            <GlassCard.Body>
              <Text style={styles.cardBody}>
                Cards compose a Surface, a Header, a Body, and an optional Footer. Dividers are
                theme-aware and use the same hairline token as the NavBar.
              </Text>
            </GlassCard.Body>
          </GlassCard>
        </Section>

        <Section title="Input">
          <GlassInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            helperText="Dynamic Type scales this all the way up."
          />
        </Section>

        <Section title="Switch">
          <View style={styles.switchColumn}>
            <GlassSwitch label="Wi-Fi" value={wifi} onValueChange={setWifi} />
            <GlassSwitch label="Bluetooth" value={bluetooth} onValueChange={setBluetooth} />
            <GlassSwitch label="Airplane mode" defaultValue={false} onValueChange={() => {}} />
          </View>
        </Section>

        <Section title="Slider">
          <GlassSlider
            label="Volume"
            value={volume}
            onValueChange={setVolume}
            formatValue={(v) => `${v}%`}
          />
        </Section>

        <Section title="Picker">
          <GlassPicker
            label="Row density"
            items={densityItems}
            value={density}
            onValueChange={setDensity}
          />
        </Section>

        <Section title="Overlays">
          <View style={styles.buttonRow}>
            <GlassButton accessibilityLabel="Open modal" onPress={() => setModalOpen(true)}>
              Modal
            </GlassButton>
            <GlassButton accessibilityLabel="Open sheet" onPress={() => setSheetOpen(true)}>
              Sheet
            </GlassButton>
            <GlassButton accessibilityLabel="Show toast" onPress={showToast}>
              Toast
            </GlassButton>
          </View>
        </Section>
      </ScrollView>

      <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
        <GlassTabBar
          items={[
            { key: 'components', label: 'Components' },
            { key: 'themes', label: 'Themes' },
            { key: 'about', label: 'About' },
          ]}
          activeKey={activeTab}
          onTabPress={(key) => setActiveTab(key as TabKey)}
          radius="none"
        />
      </View>

      <GlassModal
        visible={modalOpen}
        onDismiss={() => setModalOpen(false)}
        title="Delete artwork?"
        description="This will remove the artwork from every device signed into this account."
      >
        <View style={styles.modalActions}>
          <GlassButton
            accessibilityLabel="Cancel"
            elevation={0}
            onPress={() => setModalOpen(false)}
          >
            Cancel
          </GlassButton>
          <GlassButton
            accessibilityLabel="Delete"
            elevation={3}
            onPress={() => setModalOpen(false)}
          >
            Delete
          </GlassButton>
        </View>
      </GlassModal>

      <GlassSheet visible={sheetOpen} onDismiss={() => setSheetOpen(false)} title="Share with">
        <View style={styles.sheetList}>
          {['Messages', 'Mail', 'Copy link', 'Save to Files'].map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityLabel={item}
              style={styles.sheetItem}
              onPress={() => setSheetOpen(false)}
            >
              <Text style={styles.sheetItemText}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </GlassSheet>

      <GlassToast visible={toastVisible} message="Saved" variant="success" position="bottom" />
    </View>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      {subtitle ? <Text style={sectionStyles.subtitle}>{subtitle}</Text> : null}
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { marginBottom: 28 },
  title: { fontSize: 13, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase' },
  subtitle: { fontSize: 13, marginTop: 4, opacity: 0.7 },
  body: { marginTop: 12 },
});

function buildStyles(theme: Theme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    themeCycle: {
      minHeight: 32,
      paddingHorizontal: 14,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.divider,
    },
    themeCycleText: {
      color: theme.colors.textPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
    scroll: { flex: 1 },
    scrollContent: { padding: 20 },
    surfaceRow: { flexDirection: 'row', gap: 12 },
    surfaceTile: {
      flex: 1,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    surfaceLabel: {
      color: theme.colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    switchColumn: { gap: 8 },
    cardBody: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    tabBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    modalActions: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 12,
    },
    sheetList: { gap: 4 },
    sheetItem: {
      minHeight: 44,
      paddingHorizontal: 4,
      justifyContent: 'center',
    },
    sheetItemText: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '500',
    },
  });
}

export const themeCycleOrder: readonly ThemeName[] = ['aurora', 'obsidian', 'frost', 'sunset'];
