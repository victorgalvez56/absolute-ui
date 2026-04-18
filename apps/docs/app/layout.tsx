import { aurora, frost } from '@absolute-ui/tokens';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://absolute-ui-docs.vercel.app'),
  title: {
    default: 'Absolute UI — Liquid-glass React Native design system',
    template: '%s · Absolute UI',
  },
  description:
    'Absolute UI is a React Native liquid-glass design system with performance and accessibility as CI contracts. Four personalities, eleven primitives, APCA-safe contrast, 44pt hit targets.',
  applicationName: 'Absolute UI Docs',
  keywords: [
    'react-native',
    'design system',
    'liquid glass',
    'apca',
    'accessibility',
    'ui components',
  ],
  authors: [{ name: 'Absolute UI' }],
  openGraph: {
    title: 'Absolute UI — Liquid-glass React Native design system',
    description:
      'Four personalities. Eleven primitives. Performance and accessibility as CI contracts.',
    type: 'website',
    siteName: 'Absolute UI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Absolute UI',
    description:
      'Liquid-glass React Native design system with performance and accessibility as CI contracts.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

/**
 * Map a theme's semantic color roles onto the --aui-* CSS variables
 * consumed by `globals.css`. Runs on the server at render time so
 * the variables land in the initial HTML — no FOUC, no JS required.
 */
function themeVariables(theme: typeof aurora): Record<`--aui-${string}`, string> {
  return {
    '--aui-background': theme.colors.background,
    '--aui-surface': theme.colors.background,
    '--aui-text-primary': theme.colors.textPrimary,
    '--aui-text-secondary': theme.colors.textSecondary,
    '--aui-accent': theme.colors.accent,
    '--aui-on-accent': theme.colors.onAccent,
    '--aui-focus-ring': theme.colors.focusRing,
    '--aui-divider': theme.colors.divider,
    '--aui-danger': theme.colors.danger,
  };
}

function renderVariables(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join('\n  ');
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Light default = frost, dark default = aurora. Both ship from
  // @absolute-ui/tokens so the docs site always mirrors the canonical
  // theme data used by the primitives themselves.
  const lightVars = renderVariables(themeVariables(frost));
  const darkVars = renderVariables(themeVariables(aurora));
  const themeCss = `:root {\n  ${lightVars}\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n    ${darkVars}\n  }\n}\n`;

  return (
    <html lang="en">
      <head>
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted, static, server-rendered token values from @absolute-ui/tokens
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
