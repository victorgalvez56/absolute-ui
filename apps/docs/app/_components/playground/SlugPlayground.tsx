'use client';

/**
 * Thin client wrapper that lets a server component drop in a live
 * playground by slug. The demo registry ships functions (renderers,
 * code generators) that cannot cross the RSC serialization boundary,
 * so the lookup happens on the client side of the tree.
 */

import { getDemo } from '@/lib/demos';
import { ComponentPlayground } from './ComponentPlayground';

export function SlugPlayground({ slug }: { slug: string }) {
  const demo = getDemo(slug);
  if (!demo) return null;
  return (
    <ComponentPlayground
      initialValues={demo.initialValues}
      presets={demo.presets}
      renderControls={demo.renderControls}
      renderPreview={demo.renderPreview}
      generateCode={demo.generateCode}
    />
  );
}

export function hasSlugDemo(slug: string): boolean {
  return getDemo(slug) !== undefined;
}
