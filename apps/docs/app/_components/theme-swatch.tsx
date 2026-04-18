import type { Theme } from '@absolute-ui/tokens';
import Link from 'next/link';

/**
 * Renders a theme's personality card with a backdrop that mixes the
 * theme's accent and focus-ring colors, plus three color chips for
 * text / accent / focus. All colors come straight from the theme
 * object exported by @absolute-ui/tokens so the swatch can never
 * drift from the canonical theme values.
 */
export function ThemeSwatch({ theme }: { theme: Theme }) {
  return (
    <Link
      href={`/docs/themes/${theme.name}`}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[color:var(--color-divider)] p-5 no-underline transition-transform hover:-translate-y-1"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          backgroundImage: `radial-gradient(600px at 20% 20%, ${theme.colors.accent}55 0%, transparent 55%), radial-gradient(500px at 85% 80%, ${theme.colors.focusRing}44 0%, transparent 60%)`,
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">{theme.label}</span>
        <span
          className="text-xs uppercase tracking-wider"
          style={{ color: theme.colors.textSecondary }}
        >
          {theme.dark ? 'Dark' : 'Light'}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span
          className="h-10 w-10 rounded-lg border border-white/20"
          style={{ backgroundColor: theme.colors.accent }}
          aria-label={`Accent ${theme.colors.accent}`}
        />
        <span
          className="h-10 w-10 rounded-lg border border-white/20"
          style={{ backgroundColor: theme.colors.focusRing }}
          aria-label={`Focus ring ${theme.colors.focusRing}`}
        />
        <span
          className="h-10 w-10 rounded-lg border border-white/20"
          style={{ backgroundColor: theme.colors.divider }}
          aria-label={`Divider ${theme.colors.divider}`}
        />
      </div>
      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
        {theme.name} · motion {theme.motion.surface}/{theme.motion.press}
      </p>
    </Link>
  );
}
