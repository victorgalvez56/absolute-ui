/**
 * Shared constants for embedding the Ladle playground. The playground
 * is deployed independently (apps/ladle -> Vercel) so the docs site
 * only needs its base URL and a helper to build preview-mode URLs.
 */

export const LADLE_BASE = 'https://absolute-ui-ladle.vercel.app';

export function ladlePreviewUrl(storyId: string): string {
  const params = new URLSearchParams({ story: storyId, mode: 'preview' });
  return `${LADLE_BASE}/?${params.toString()}`;
}
