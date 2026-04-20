import { TextControl, ToggleControl } from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { DemoConfig } from './types';

type Values = {
  title: string;
  showLeading: boolean;
  showTrailing: boolean;
};

export const glassNavBarDemo: DemoConfig<Values> = {
  initialValues: { title: 'Inbox', showLeading: true, showTrailing: true },
  presets: [
    { label: 'Full', values: { title: 'Inbox', showLeading: true, showTrailing: true } },
    { label: 'Centered only', values: { showLeading: false, showTrailing: false } },
    { label: 'Trailing only', values: { showLeading: false, showTrailing: true } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <TextControl label="title" value={values.title} onChange={(v) => setValue('title', v)} />
      <ToggleControl
        label="leading slot"
        value={values.showLeading}
        onChange={(v) => setValue('showLeading', v)}
        hint="Usually a back chevron or close glyph."
      />
      <ToggleControl
        label="trailing slot"
        value={values.showTrailing}
        onChange={(v) => setValue('showTrailing', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => (
    <div
      style={{
        ...glassStyleFor(theme, 2, 'none'),
        width: '100%',
        maxWidth: 420,
        borderRadius: 0,
      }}
    >
      <div aria-hidden style={noiseStyleFor(theme, 2)} />
      <div className="relative flex h-14 items-center px-3">
        <div className="flex w-16 items-center">
          {values.showLeading ? (
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ color: theme.colors.textPrimary }}
              aria-label="Back"
            >
              ←
            </button>
          ) : null}
        </div>
        <div
          className="flex-1 truncate text-center text-base font-semibold"
          style={{ color: theme.colors.textPrimary }}
        >
          {values.title}
        </div>
        <div className="flex w-16 items-center justify-end">
          {values.showTrailing ? (
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ color: theme.colors.textPrimary }}
              aria-label="More"
            >
              ⋯
            </button>
          ) : null}
        </div>
      </div>
    </div>
  ),
  generateCode: ({ values }) => {
    const lines: string[] = ['<GlassNavBar'];
    lines.push(`  title="${values.title}"`);
    if (values.showLeading) {
      lines.push('  leading={<GlassButton accessibilityLabel="Back">←</GlassButton>}');
    }
    if (values.showTrailing) {
      lines.push('  trailing={<GlassButton accessibilityLabel="More">⋯</GlassButton>}');
    }
    lines.push('/>');
    return lines.join('\n');
  },
};
