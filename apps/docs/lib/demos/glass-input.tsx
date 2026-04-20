import { TextControl, ToggleControl } from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { DemoConfig } from './types';

type Values = {
  label: string;
  placeholder: string;
  value: string;
  helper: string;
  secure: boolean;
  invalid: boolean;
  disabled: boolean;
};

export const glassInputDemo: DemoConfig<Values> = {
  initialValues: {
    label: 'Email',
    placeholder: 'you@studio.app',
    value: '',
    helper: 'We never share your email.',
    secure: false,
    invalid: false,
    disabled: false,
  },
  presets: [
    { label: 'Empty', values: { value: '', invalid: false, disabled: false } },
    { label: 'Filled', values: { value: 'victor@absolute.ui', invalid: false } },
    { label: 'Invalid', values: { value: 'not-an-email', invalid: true } },
    { label: 'Secure', values: { secure: true, label: 'Password', placeholder: '••••••••' } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <TextControl label="label" value={values.label} onChange={(v) => setValue('label', v)} />
      <TextControl
        label="placeholder"
        value={values.placeholder}
        onChange={(v) => setValue('placeholder', v)}
      />
      <TextControl label="value" value={values.value} onChange={(v) => setValue('value', v)} />
      <TextControl label="helper" value={values.helper} onChange={(v) => setValue('helper', v)} />
      <ToggleControl
        label="secureTextEntry"
        value={values.secure}
        onChange={(v) => setValue('secure', v)}
      />
      <ToggleControl
        label="invalid"
        value={values.invalid}
        onChange={(v) => setValue('invalid', v)}
        hint="Swaps the focus ring for theme.danger and adds accessibilityState.invalid."
      />
      <ToggleControl
        label="disabled"
        value={values.disabled}
        onChange={(v) => setValue('disabled', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => {
    const ringColor = values.invalid ? theme.colors.danger : theme.colors.focusRing;
    const shown = values.secure && values.value
      ? '•'.repeat(Math.min(values.value.length, 12))
      : values.value;
    return (
      <div className="w-full max-w-sm">
        {values.label ? (
          <label
            className="mb-2 block text-sm font-semibold"
            style={{ color: theme.colors.textPrimary }}
          >
            {values.label}
          </label>
        ) : null}
        <div
          style={{
            ...glassStyleFor(theme, 1, 'lg'),
            opacity: values.disabled ? 0.45 : 1,
            boxShadow: values.invalid ? `0 0 0 2px ${ringColor}` : undefined,
          }}
        >
          <div aria-hidden style={noiseStyleFor(theme, 1)} />
          <div
            className="relative flex items-center px-4"
            style={{ minHeight: 48 }}
          >
            <span
              className="text-base"
              style={{
                color: values.value ? theme.colors.textPrimary : theme.colors.textSecondary,
                opacity: values.value ? 1 : 0.7,
              }}
            >
              {shown || values.placeholder}
            </span>
          </div>
        </div>
        {values.helper ? (
          <p
            className="mt-1.5 text-xs"
            style={{ color: values.invalid ? theme.colors.danger : theme.colors.textSecondary }}
          >
            {values.helper}
          </p>
        ) : null}
      </div>
    );
  },
  generateCode: ({ values }) => {
    const lines: string[] = ['<GlassInput'];
    if (values.label) lines.push(`  label="${values.label}"`);
    if (values.placeholder) lines.push(`  placeholder="${values.placeholder}"`);
    lines.push(`  value="${values.value}"`);
    lines.push('  onChangeText={setValue}');
    if (values.helper) lines.push(`  helperText="${values.helper}"`);
    if (values.secure) lines.push('  secureTextEntry');
    if (values.invalid) lines.push('  invalid');
    if (values.disabled) lines.push('  disabled');
    lines.push('/>');
    return lines.join('\n');
  },
};
