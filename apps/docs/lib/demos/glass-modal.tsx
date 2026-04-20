import { TextControl, ToggleControl } from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { DemoConfig } from './types';

type Values = {
  visible: boolean;
  title: string;
  description: string;
};

export const glassModalDemo: DemoConfig<Values> = {
  initialValues: {
    visible: true,
    title: 'Delete project?',
    description: 'This permanently removes the project and every shared link. This cannot be undone.',
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
      />
      <TextControl label="title" value={values.title} onChange={(v) => setValue('title', v)} />
      <TextControl
        label="description"
        value={values.description}
        onChange={(v) => setValue('description', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => (
    <div
      className="relative overflow-hidden"
      style={{
        width: 360,
        height: 280,
        borderRadius: 24,
        border: `2px solid ${theme.colors.divider}`,
        backgroundColor: theme.dark ? '#020407' : '#F5F7FA',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(500px at 30% 20%, ${theme.colors.accent}55 0%, transparent 55%), radial-gradient(400px at 70% 80%, ${theme.colors.focusRing}44 0%, transparent 60%)`,
        }}
      />
      {values.visible ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: theme.dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)' }}
          />
          <div
            className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2"
            style={{
              ...glassStyleFor(theme, 3, 'xl'),
              padding: 20,
            }}
          >
            <div aria-hidden style={noiseStyleFor(theme, 3)} />
            <div className="relative">
              <div
                className="text-base font-semibold"
                style={{ color: theme.colors.textPrimary }}
              >
                {values.title}
              </div>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: theme.colors.textSecondary }}
              >
                {values.description}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{
                    border: `1px solid ${theme.colors.divider}`,
                    color: theme.colors.textSecondary,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-full px-4 py-1.5 text-sm font-semibold"
                  style={{
                    backgroundColor: theme.colors.danger,
                    color: theme.colors.onAccent,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p
          className="absolute inset-x-0 bottom-3 text-center text-xs"
          style={{ color: theme.colors.textSecondary }}
        >
          Modal dismissed — toggle visible to mount.
        </p>
      )}
    </div>
  ),
  generateCode: ({ values }) =>
    `<GlassModal
  visible={${values.visible}}
  onDismiss={() => setOpen(false)}
  title="${values.title}"
  description="${values.description}"
>
  <GlassButton accessibilityLabel="Delete">Delete</GlassButton>
</GlassModal>`,
};
