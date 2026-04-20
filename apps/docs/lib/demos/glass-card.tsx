import {
  SelectControl,
  TextControl,
  ToggleControl,
} from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { GlassElevation } from '@absolute-ui/tokens';
import type { DemoConfig } from './types';

type Values = {
  title: string;
  subtitle: string;
  body: string;
  elevation: GlassElevation;
  radius: 'md' | 'lg' | 'xl' | '2xl';
  showFooter: boolean;
  showDivider: boolean;
};

const radiusOptions = [
  { label: 'md', value: 'md' as const },
  { label: 'lg (default)', value: 'lg' as const },
  { label: 'xl', value: 'xl' as const },
  { label: '2xl', value: '2xl' as const },
];

const elevationOptions = [
  { label: '1 — card (default)', value: '1' },
  { label: '2 — lifted', value: '2' },
  { label: '3 — modal-adjacent', value: '3' },
];

export const glassCardDemo: DemoConfig<Values> = {
  initialValues: {
    title: 'Aurora session',
    subtitle: 'Glass refracts the theme personality.',
    body: 'Each card is a GlassSurface at elevation 1 with header, body, and footer slots. The divider is a hairline mixed from theme.colors.divider.',
    elevation: 1,
    radius: 'lg',
    showFooter: true,
    showDivider: true,
  },
  presets: [
    {
      label: 'Default',
      values: { elevation: 1, radius: 'lg', showFooter: true, showDivider: true },
    },
    { label: 'No footer', values: { showFooter: false, showDivider: false } },
    { label: 'Lifted', values: { elevation: 2, radius: 'xl', showFooter: true } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <TextControl
        label="header.title"
        value={values.title}
        onChange={(v) => setValue('title', v)}
      />
      <TextControl
        label="header.subtitle"
        value={values.subtitle}
        onChange={(v) => setValue('subtitle', v)}
      />
      <TextControl label="body" value={values.body} onChange={(v) => setValue('body', v)} />
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
      />
      <ToggleControl
        label="Card.Divider"
        value={values.showDivider}
        onChange={(v) => setValue('showDivider', v)}
      />
      <ToggleControl
        label="Card.Footer"
        value={values.showFooter}
        onChange={(v) => setValue('showFooter', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => (
    <div
      style={{
        ...glassStyleFor(theme, values.elevation, values.radius),
        width: '100%',
        maxWidth: 420,
      }}
    >
      <div aria-hidden style={noiseStyleFor(theme, values.elevation)} />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className="text-base font-semibold leading-snug"
              style={{ color: theme.colors.textPrimary }}
            >
              {values.title}
            </div>
            {values.subtitle ? (
              <div
                className="mt-1 text-sm leading-snug"
                style={{ color: theme.colors.textSecondary }}
              >
                {values.subtitle}
              </div>
            ) : null}
          </div>
          <div
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.onAccent,
              fontWeight: 700,
            }}
          >
            ✦
          </div>
        </div>
        {values.showDivider ? (
          <div
            aria-hidden
            className="my-4 h-px w-full"
            style={{ backgroundColor: theme.colors.divider }}
          />
        ) : (
          <div className="mt-4" />
        )}
        <p className="text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>
          {values.body}
        </p>
        {values.showFooter ? (
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              className="rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{
                color: theme.colors.textSecondary,
                border: `1px solid ${theme.colors.divider}`,
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-full px-4 py-1.5 text-sm font-semibold"
              style={{
                backgroundColor: theme.colors.accent,
                color: theme.colors.onAccent,
              }}
            >
              Continue
            </button>
          </div>
        ) : null}
      </div>
    </div>
  ),
  generateCode: ({ values }) => {
    const lines: string[] = [
      `<GlassCard elevation={${values.elevation}} radius="${values.radius}">`,
      `  <GlassCard.Header title="${values.title}"${
        values.subtitle ? ` subtitle="${values.subtitle}"` : ''
      } />`,
    ];
    if (values.showDivider) lines.push('  <GlassCard.Divider />');
    lines.push('  <GlassCard.Body>');
    lines.push(`    <Text>${values.body}</Text>`);
    lines.push('  </GlassCard.Body>');
    if (values.showFooter) {
      lines.push('  <GlassCard.Footer>');
      lines.push('    <GlassButton accessibilityLabel="Continue">Continue</GlassButton>');
      lines.push('  </GlassCard.Footer>');
    }
    lines.push('</GlassCard>');
    return lines.join('\n');
  },
};
