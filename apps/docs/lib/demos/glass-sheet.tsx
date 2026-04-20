import { TextControl, ToggleControl } from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { DemoConfig } from './types';

type Values = {
  visible: boolean;
  title: string;
  body: string;
};

export const glassSheetDemo: DemoConfig<Values> = {
  initialValues: {
    visible: true,
    title: 'Share',
    body: 'Choose how you want to share this file. Tap the backdrop to dismiss — GlassSheet does not animate in Phase 1; the motion layer arrives in Phase 4.',
  },
  presets: [
    { label: 'Visible', values: { visible: true } },
    { label: 'Dismissed', values: { visible: false } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <ToggleControl
        label="visible"
        value={values.visible}
        onChange={(v) => setValue('visible', v)}
        hint="Sheet unmounts when false — no fade in Phase 1."
      />
      <TextControl label="title" value={values.title} onChange={(v) => setValue('title', v)} />
      <TextControl label="body" value={values.body} onChange={(v) => setValue('body', v)} />
    </>
  ),
  renderPreview: ({ values, theme }) => (
    <div
      className="relative overflow-hidden"
      style={{
        width: 320,
        height: 480,
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
      <div className="absolute left-1/2 top-2 h-1 w-16 -translate-x-1/2 rounded-full bg-white/20" />
      <div className="absolute inset-x-0 top-10 px-6">
        <p className="text-xs uppercase tracking-widest" style={{ color: theme.colors.textSecondary }}>
          App screen
        </p>
        <p className="mt-1 text-sm" style={{ color: theme.colors.textPrimary }}>
          Content behind the sheet.
        </p>
      </div>
      {values.visible ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: theme.dark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.35)' }}
          />
          <div
            className="absolute inset-x-3 bottom-3"
            style={{
              ...glassStyleFor(theme, 3, 'xl'),
              padding: 20,
            }}
          >
            <div aria-hidden style={noiseStyleFor(theme, 3)} />
            <div className="relative">
              <div
                aria-hidden
                className="mx-auto mb-3 h-1 w-10 rounded-full"
                style={{ backgroundColor: theme.colors.divider }}
              />
              {values.title ? (
                <div
                  className="text-base font-semibold"
                  style={{ color: theme.colors.textPrimary }}
                >
                  {values.title}
                </div>
              ) : null}
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: theme.colors.textSecondary }}
              >
                {values.body}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.onAccent,
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  ),
  generateCode: ({ values }) =>
    `<GlassSheet
  visible={${values.visible}}
  onDismiss={() => setOpen(false)}
  title="${values.title}"
>
  <Text>${values.body}</Text>
</GlassSheet>`,
};
