import {
  SelectControl,
  SliderControl,
} from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { GlassElevation } from '@absolute-ui/tokens';
import type { DemoConfig } from './types';

type Values = {
  elevation: GlassElevation;
  radius: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'pill';
  padding: number;
};

const radiusOptions = [
  { label: 'none', value: 'none' as const },
  { label: 'sm', value: 'sm' as const },
  { label: 'md', value: 'md' as const },
  { label: 'lg', value: 'lg' as const },
  { label: 'xl', value: 'xl' as const },
  { label: '2xl', value: '2xl' as const },
  { label: 'pill', value: 'pill' as const },
];

const elevationOptions = [
  { label: '0 — inline', value: '0' },
  { label: '1 — card', value: '1' },
  { label: '2 — nav bar', value: '2' },
  { label: '3 — modal', value: '3' },
];

export const glassSurfaceDemo: DemoConfig<Values> = {
  initialValues: { elevation: 1, radius: 'lg', padding: 32 },
  presets: [
    { label: 'Inline chip', values: { elevation: 0, radius: 'pill', padding: 12 } },
    { label: 'Card', values: { elevation: 1, radius: 'lg', padding: 32 } },
    { label: 'Nav bar', values: { elevation: 2, radius: 'none', padding: 20 } },
    { label: 'Modal', values: { elevation: 3, radius: 'xl', padding: 40 } },
  ],
  renderControls: ({ values, setValue }) => (
    <>
      <SelectControl
        label="elevation"
        value={String(values.elevation)}
        options={elevationOptions}
        onChange={(v) => setValue('elevation', Number(v) as GlassElevation)}
        hint="Higher elevations add blur, saturation, and a stronger tint."
      />
      <SelectControl
        label="radius"
        value={values.radius}
        options={radiusOptions}
        onChange={(v) => setValue('radius', v)}
      />
      <SliderControl
        label="padding"
        value={values.padding}
        min={8}
        max={64}
        step={4}
        suffix="dp"
        onChange={(v) => setValue('padding', v)}
      />
    </>
  ),
  renderPreview: ({ values, theme }) => (
    <div className="flex w-full items-center justify-center">
      <div
        style={{
          ...glassStyleFor(theme, values.elevation, values.radius),
          padding: values.padding,
          minWidth: 240,
          maxWidth: 420,
        }}
      >
        <div aria-hidden style={noiseStyleFor(theme, values.elevation)} />
        <div className="relative">
          <div className="text-xs uppercase tracking-widest" style={{ color: theme.colors.textSecondary }}>
            Elevation {values.elevation}
          </div>
          <div
            className="mt-2 text-lg font-semibold"
            style={{ color: theme.colors.textPrimary }}
          >
            {theme.label} glass surface
          </div>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            Real tokens. Real blur. Every personality lays its own tint over the backdrop.
          </p>
        </div>
      </div>
    </div>
  ),
  generateCode: ({ values }) =>
    `<GlassSurface elevation={${values.elevation}} radius="${values.radius}" style={{ padding: ${values.padding} }}>
  <Text>${values.padding >= 24 ? 'Hello, liquid glass.' : 'Inline chip'}</Text>
</GlassSurface>`,
};
