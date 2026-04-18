import { expect, test } from '@playwright/test';
import { loadStories } from '../scripts/enumerate-stories.ts';

/**
 * Loops every Ladle story and asserts the rendered screenshot matches
 * the checked-in baseline to within 0.1% of pixels.
 *
 * First run: snapshots are written under `tests/stories.spec.ts-snapshots/`.
 * Subsequent runs: diffs are flagged and reported under `playwright-report/`.
 */

const stories = loadStories();

test.describe.parallel('ladle stories', () => {
  for (const story of stories) {
    test(story.id, async ({ page }) => {
      await page.goto(story.url, { waitUntil: 'networkidle' });
      // Give animations/transitions a beat to settle.
      await page.waitForTimeout(250);
      await expect(page).toHaveScreenshot(`${story.id}.png`, {
        fullPage: false,
        animations: 'disabled',
        caret: 'hide',
        maxDiffPixelRatio: 0.001,
      });
    });
  }
});
