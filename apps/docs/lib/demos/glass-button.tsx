import {
  SelectControl,
  TextControl,
  ToggleControl,
} from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { GlassElevation } from '@absolute-ui/tokens';
import type { DemoConfig } from './types';

type Values = {
  label: string;
  elevation: GlassElevation;
  radius: 'md' | 'lg' | 'xl' | '2xl' | 'pill';
  disabled: boolean;
};

const radiusOptions = [
  { label: 'md', value: 'md' as const },
  { label: 'lg', value: 'lg' as const },
  { label: 'xl', value: 'xl' as const },
  { label: '2xl', value: '2xl' as const },
  { label: 'pill', value: 'pill' as const },
];

const elevationOptions = [
  { label: '0 — inline', value: '0' },
  { label: '1 — button (default)', value: '1' },
  { label: '2 — lifted', value: '2' },
  { label: '3 — overlay', value: '3' },
];

export const glassButtonDemo: DemoConfig<Values> = {
  initialValues: { label: 'Continue', elevation: 1, radius: 'pill', disabled: false },
  presets: [
    { label: 'Primary', values: { label: 'Continue', elevation: 1, radius: 'pill', disabled: false } },
    { label: 'Compact', values: { label: 'Save', elevation: 1, radius: 'md', disabled: false } },
    { label: 'Disabled', values: { label: 'Submit', elevation: 1, radius: 'pill', disabled: true } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <TextControl
        label="children"
        value={values.label}
        onChange={(v) => setValue('label', v)}
        hint="Button label. Wrapped in themed Text when passed as a string."
      />
      <SelectControl
        label="elevation"
        value={String(values.elevation)}
        options={elevationOptions}
        onChange={(v) => setValue('elevation', Number(v) as GlassElevation)}
      />
      <SelectControl
        label="radius"
        value={values.radius}
        options={radiusOptions}
        onChange={(v) => setValue('radius', v)}
        hint="Default 'pill' ships the classic liquid-glass capsule."
      />
      <ToggleControl
        label="disabled"
        value={values.disabled}
        onChange={(v) => setValue('disabled', v)}
        hint="Dims the surface and suppresses the press target."
      />
    </>
  ),
  renderPreview: ({ values, theme }) => {
    const label = values.label.trim() || 'Continue';
    return (
      <button
        type="button"
        disabled={values.disabled}
        className="relative inline-flex min-h-[44px] items-center justify-center px-6 py-2.5 font-semibold transition-transform active:scale-[0.98]"
        style={{
          ...glassStyleFor(theme, values.elevation, values.radius),
          minWidth: 120,
          opacity: values.disabled ? 0.45 : 1,
          color: theme.colors.textPrimary,
          cursor: values.disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span aria-hidden style={noiseStyleFor(theme, values.elevation)} />
        <span className="relative">{label}</span>
      </button>
    );
  },
  generateCode: ({ values }) => {
    const lines = [
      `<GlassButton`,
      `  accessibilityLabel="${values.label}"`,
      `  elevation={${values.elevation}}`,
      `  radius="${values.radius}"`,
    ];
    if (values.disabled) lines.push('  disabled');
    lines.push(`  onPress={() => {}}`);
    lines.push('>');
    lines.push(`  ${values.label}`);
    lines.push('</GlassButton>');
    return lines.join('\n');
  },
};
