/**
 * Shared constants for embedding the Storybook playground. Storybook
 * is deployed independently (apps/storybook -> Vercel) so the docs
 * site only needs its base URL and a helper to build iframe URLs.
 */

export const STORYBOOK_BASE =
  process.env.NEXT_PUBLIC_STORYBOOK_BASE ?? 'https://absolute-ui-storybook.vercel.app';

export function storybookPreviewUrl(storyId: string): string {
  const params = new URLSearchParams({
    id: storyId,
    viewMode: 'story',
    // Hide the story toolbar — the docs page already frames the preview.
    nav: '0',
    panel: 'false',
  });
  return `${STORYBOOK_BASE}/iframe.html?${params.toString()}`;
}

export function storybookStoryUrl(storyId: string): string {
  const params = new URLSearchParams({ path: `/story/${storyId}` });
  return `${STORYBOOK_BASE}/?${params.toString()}`;
}
