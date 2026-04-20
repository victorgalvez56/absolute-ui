import { SelectControl, TextControl, ToggleControl } from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { DemoConfig } from './types';

type Variant = 'default' | 'success' | 'error' | 'info';
type Position = 'top' | 'bottom';

type Values = {
  visible: boolean;
  message: string;
  variant: Variant;
  position: Position;
};

const variantOptions = [
  { label: 'default', value: 'default' as Variant },
  { label: 'success', value: 'success' as Variant },
  { label: 'error', value: 'error' as Variant },
  { label: 'info', value: 'info' as Variant },
];

const positionOptions = [
  { label: 'top', value: 'top' as Position },
  { label: 'bottom', value: 'bottom' as Position },
];

function stripeFor(variant: Variant, accent: string): string {
  if (variant === 'success') return '#4ADE80';
  if (variant === 'error') return '#F87171';
  if (variant === 'info') return '#60A5FA';
  return accent;
}

export const glassToastDemo: DemoConfig<Values> = {
  initialValues: {
    visible: true,
    message: 'Copied to clipboard',
    variant: 'success',
    position: 'bottom',
  },
  presets: [
    { label: 'Success', values: { variant: 'success', message: 'Saved' } },
    { label: 'Error', values: { variant: 'error', message: 'Upload failed' } },
    { label: 'Info', values: { variant: 'info', message: 'Sync in progress' } },
    { label: 'Default', values: { variant: 'default', message: 'Done' } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <ToggleControl
        label="visible"
        value={values.visible}
        onChange={(v) => setValue('visible', v)}
      />
      <TextControl
        label="message"
        value={values.message}
        onChange={(v) => setValue('message', v)}
      />
      <SelectControl
        label="variant"
        value={values.variant}
        options={variantOptions}
        onChange={(v) => setValue('variant', v)}
      />
      <SelectControl
        label="position"
        value={values.position}
        options={positionOptions}
        onChange={(v) => setValue('position', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => {
    const stripe = stripeFor(values.variant, theme.colors.accent);
    return (
      <div
        className="relative overflow-hidden"
        style={{
          width: 320,
          height: 420,
          borderRadius: 40,
          border: `2px solid ${theme.colors.divider}`,
          backgroundColor: theme.dark ? '#020407' : '#F5F7FA',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(500px at 20% 10%, ${theme.colors.accent}55 0%, transparent 55%), radial-gradient(400px at 80% 90%, ${theme.colors.focusRing}44 0%, transparent 60%)`,
          }}
        />
        {values.visible ? (
          <div
            className="absolute inset-x-4 flex items-center gap-3 px-4 py-3"
            style={{
              ...glassStyleFor(theme, 2, 'xl'),
              top: values.position === 'top' ? 16 : undefined,
              bottom: values.position === 'bottom' ? 16 : undefined,
            }}
          >
            <div aria-hidden style={noiseStyleFor(theme, 2)} />
            <span
              aria-hidden
              className="relative inline-block h-6 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: stripe }}
            />
            <span
              className="relative text-sm font-medium"
              style={{ color: theme.colors.textPrimary }}
            >
              {values.message}
            </span>
          </div>
        ) : (
          <p
            className="absolute inset-x-0 bottom-4 text-center text-xs"
            style={{ color: theme.colors.textSecondary }}
          >
            Toast dismissed.
          </p>
        )}
      </div>
    );
  },
  generateCode: ({ values }) =>
    `<GlassToast
  visible={${values.visible}}
  message="${values.message}"
  variant="${values.variant}"
  position="${values.position}"
/>`,
};
