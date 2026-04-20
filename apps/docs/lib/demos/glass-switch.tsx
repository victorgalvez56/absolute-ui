import { TextControl, ToggleControl } from '@/app/_components/playground/controls';
import type { DemoConfig } from './types';

type Values = {
  label: string;
  value: boolean;
  disabled: boolean;
};

export const glassSwitchDemo: DemoConfig<Values> = {
  initialValues: { label: 'Reduced motion', value: true, disabled: false },
  presets: [
    { label: 'On', values: { value: true, disabled: false } },
    { label: 'Off', values: { value: false, disabled: false } },
    { label: 'Disabled', values: { value: true, disabled: true } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <TextControl label="label" value={values.label} onChange={(v) => setValue('label', v)} />
      <ToggleControl
        label="value"
        value={values.value}
        onChange={(v) => setValue('value', v)}
      />
      <ToggleControl
        label="disabled"
        value={values.disabled}
        onChange={(v) => setValue('disabled', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => (
    <button
      type="button"
      aria-checked={values.value}
      role="switch"
      disabled={values.disabled}
      className="flex min-h-[44px] items-center justify-between gap-4 rounded-2xl px-4 py-2"
      style={{
        opacity: values.disabled ? 0.45 : 1,
        minWidth: 280,
        border: `1px solid ${theme.colors.divider}`,
        backgroundColor: `${theme.colors.divider}22`,
        color: theme.colors.textPrimary,
        cursor: values.disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span className="text-sm font-medium">{values.label}</span>
      <span
        className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors"
        style={{
          backgroundColor: values.value
            ? theme.colors.accent
            : `${theme.colors.divider}`,
          border: `1px solid ${values.value ? theme.colors.accent : theme.colors.divider}`,
        }}
      >
        <span
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-[left]"
          style={{
            left: values.value ? 22 : 2,
            backgroundColor: values.value ? theme.colors.onAccent : theme.colors.textPrimary,
          }}
          aria-hidden
        />
      </span>
    </button>
  ),
  generateCode: ({ values }) => {
    const lines: string[] = ['<GlassSwitch'];
    if (values.label) lines.push(`  label="${values.label}"`);
    lines.push(`  value={${values.value}}`);
    lines.push('  onValueChange={setValue}');
    if (values.disabled) lines.push('  disabled');
    lines.push('/>');
    return lines.join('\n');
  },
};
