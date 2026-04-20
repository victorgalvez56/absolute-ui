import { SelectControl, ToggleControl } from '@/app/_components/playground/controls';
import type { DemoConfig } from './types';

type Values = {
  label: string;
  value: 'day' | 'week' | 'month' | 'year';
  disabled: boolean;
};

const SEGMENTS = [
  { key: 'day' as const, label: 'Day' },
  { key: 'week' as const, label: 'Week' },
  { key: 'month' as const, label: 'Month' },
  { key: 'year' as const, label: 'Year' },
];

const options = SEGMENTS.map((s) => ({ label: s.label, value: s.key }));

export const glassPickerDemo: DemoConfig<Values> = {
  initialValues: { label: 'Range', value: 'week', disabled: false },
  presets: SEGMENTS.map((s) => ({ label: s.label, values: { value: s.key } })),
  renderControls: ({ values, setValue }) => (
    <>
      <SelectControl
        label="value"
        value={values.value}
        options={options}
        onChange={(v) => setValue('value', v as Values['value'])}
      />
      <ToggleControl
        label="disabled"
        value={values.disabled}
        onChange={(v) => setValue('disabled', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => (
    <div className="w-full max-w-md">
      <div
        className="mb-2 text-xs font-semibold uppercase tracking-widest"
        style={{ color: theme.colors.textSecondary }}
      >
        {values.label}
      </div>
      <div
        className="flex gap-1 rounded-full p-1"
        role="radiogroup"
        style={{
          border: `1px solid ${theme.colors.divider}`,
          backgroundColor: `${theme.colors.divider}22`,
          opacity: values.disabled ? 0.45 : 1,
        }}
      >
        {SEGMENTS.map((seg) => {
          const active = seg.key === values.value;
          return (
            <button
              key={seg.key}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={values.disabled}
              className="min-h-[40px] flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: active ? theme.colors.accent : 'transparent',
                color: active ? theme.colors.onAccent : theme.colors.textPrimary,
                cursor: values.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {seg.label}
            </button>
          );
        })}
      </div>
    </div>
  ),
  generateCode: ({ values }) =>
    `const items = [
  { label: 'Day',   value: 'day' },
  { label: 'Week',  value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year',  value: 'year' },
];

<GlassPicker
  label="${values.label}"
  items={items}
  value="${values.value}"
  onValueChange={setValue}${values.disabled ? '\n  disabled' : ''}
/>`,
};
