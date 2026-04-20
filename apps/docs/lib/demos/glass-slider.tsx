import {
  SliderControl,
  TextControl,
  ToggleControl,
} from '@/app/_components/playground/controls';
import type { DemoConfig } from './types';

type Values = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
};

export const glassSliderDemo: DemoConfig<Values> = {
  initialValues: {
    label: 'Brightness',
    value: 60,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  presets: [
    { label: 'Brightness', values: { label: 'Brightness', min: 0, max: 100, step: 1, value: 60 } },
    { label: 'Volume', values: { label: 'Volume', min: 0, max: 10, step: 0.5, value: 6 } },
    { label: 'Disabled', values: { disabled: true } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <TextControl label="label" value={values.label} onChange={(v) => setValue('label', v)} />
      <SliderControl
        label="value"
        value={values.value}
        min={values.min}
        max={values.max}
        step={values.step}
        onChange={(v) => setValue('value', v)}
      />
      <SliderControl
        label="min"
        value={values.min}
        min={-50}
        max={values.max - 1}
        step={1}
        onChange={(v) => setValue('min', v)}
      />
      <SliderControl
        label="max"
        value={values.max}
        min={values.min + 1}
        max={200}
        step={1}
        onChange={(v) => setValue('max', v)}
      />
      <ToggleControl
        label="disabled"
        value={values.disabled}
        onChange={(v) => setValue('disabled', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => {
    const clamped = Math.max(values.min, Math.min(values.max, values.value));
    const progress = ((clamped - values.min) / (values.max - values.min)) * 100;
    return (
      <div
        className="w-full max-w-sm rounded-2xl p-4"
        style={{
          border: `1px solid ${theme.colors.divider}`,
          backgroundColor: `${theme.colors.divider}22`,
          opacity: values.disabled ? 0.45 : 1,
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span
            className="text-sm font-semibold"
            style={{ color: theme.colors.textPrimary }}
          >
            {values.label}
          </span>
          <span
            className="font-mono text-xs tabular-nums"
            style={{ color: theme.colors.textSecondary }}
          >
            {clamped.toFixed(values.step < 1 ? 1 : 0)}
          </span>
        </div>
        <div
          className="relative h-2 w-full rounded-full"
          style={{ backgroundColor: `${theme.colors.divider}` }}
        >
          <div
            className="h-2 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: theme.colors.accent,
            }}
          />
          <div
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
            style={{
              left: `${progress}%`,
              backgroundColor: theme.colors.onAccent,
              border: `2px solid ${theme.colors.accent}`,
            }}
          />
        </div>
      </div>
    );
  },
  generateCode: ({ values }) => {
    const lines: string[] = ['<GlassSlider'];
    if (values.label) lines.push(`  label="${values.label}"`);
    lines.push(`  value={${values.value}}`);
    lines.push(`  minimumValue={${values.min}}`);
    lines.push(`  maximumValue={${values.max}}`);
    lines.push(`  step={${values.step}}`);
    lines.push('  onValueChange={setValue}');
    if (values.disabled) lines.push('  disabled');
    lines.push('/>');
    return lines.join('\n');
  },
};
