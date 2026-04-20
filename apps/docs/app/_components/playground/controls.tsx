'use client';

/**
 * Interactive control primitives used by the component playground.
 * Intentionally styled to match the surrounding glass system — not a
 * generic form library — so the controls feel like part of the
 * component being demonstrated.
 *
 * Each control is a controlled input. The playground owns the values
 * and passes them through so the preview and generated code stay in
 * lockstep.
 */

import type { ReactNode } from 'react';

type FieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
};

export function Field({ label, hint, children, htmlFor }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold uppercase tracking-widest text-[color:var(--color-text-secondary)]"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <span className="text-[11px] text-[color:var(--color-text-secondary)]">{hint}</span>
      ) : null}
    </div>
  );
}

export function ToggleControl({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className="group relative inline-flex h-7 w-12 items-center rounded-full border border-[color:var(--color-divider)] transition-colors"
        style={{
          backgroundColor: value
            ? 'color-mix(in oklab, var(--color-accent) 75%, transparent)'
            : 'color-mix(in oklab, var(--color-divider) 80%, transparent)',
        }}
      >
        <span
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-[left] duration-150 ease-out"
          style={{
            left: value ? 22 : 2,
            backgroundColor: value ? 'var(--color-on-accent)' : 'var(--color-text-primary)',
          }}
          aria-hidden
        />
      </button>
    </Field>
  );
}

export function SelectControl<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ label: string; value: T }>;
  onChange: (next: T) => void;
  hint?: string;
}) {
  const id = `sel-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none rounded-lg border border-[color:var(--color-divider)] bg-[color-mix(in_oklab,var(--color-background)_60%,transparent)] px-3 py-2 pr-8 text-sm outline-none transition-colors hover:border-[color:var(--color-accent)] focus:border-[color:var(--color-accent)]"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[color:var(--color-text-secondary)]"
        >
          ▾
        </span>
      </div>
    </Field>
  );
}

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  suffix?: string;
  hint?: string;
}) {
  const id = `sld-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[color-mix(in_oklab,var(--color-divider)_80%,transparent)] accent-[color:var(--color-accent)]"
        />
        <span className="w-16 text-right font-mono text-xs tabular-nums text-[color:var(--color-text-secondary)]">
          {value}
          {suffix ?? ''}
        </span>
      </div>
    </Field>
  );
}

export function TextControl({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  const id = `txt-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[color:var(--color-divider)] bg-[color-mix(in_oklab,var(--color-background)_60%,transparent)] px-3 py-2 text-sm outline-none transition-colors hover:border-[color:var(--color-accent)] focus:border-[color:var(--color-accent)]"
      />
    </Field>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ label: string; value: T }>;
  onChange: (next: T) => void;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="inline-flex rounded-lg border border-[color:var(--color-divider)] p-0.5">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={active}
              className="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                backgroundColor: active
                  ? 'color-mix(in oklab, var(--color-accent) 85%, transparent)'
                  : 'transparent',
                color: active ? 'var(--color-on-accent)' : 'var(--color-text-secondary)',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}
