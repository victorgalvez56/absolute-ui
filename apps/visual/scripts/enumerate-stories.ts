import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Reads `apps/ladle/build/meta.json` and emits the list of story IDs
 * that the visual suite should diff.
 *
 * Pre-req: run `pnpm --dir apps/ladle build` so the meta file exists.
 */

export interface StoryEntry {
  id: string;
  url: string;
}

const PREVIEW_ORIGIN = 'http://localhost:4175';

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_META_PATH = resolve(here, '../../ladle/build/meta.json');

interface LadleMeta {
  stories: Record<string, { name: string; levels: string[] }>;
}

export function loadStories(metaPath: string = DEFAULT_META_PATH): StoryEntry[] {
  let raw: string;
  try {
    raw = readFileSync(metaPath, 'utf8');
  } catch (err) {
    throw new Error(
      `Could not read ${metaPath}. Run \`pnpm --dir apps/ladle build\` first. (${
        (err as Error).message
      })`,
    );
  }

  const meta = JSON.parse(raw) as LadleMeta;
  const ids = Object.keys(meta.stories ?? {}).sort();
  return ids.map((id) => ({
    id,
    url: `${PREVIEW_ORIGIN}/?story=${encodeURIComponent(id)}&mode=preview`,
  }));
}

function isMain(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return fileURLToPath(import.meta.url) === resolve(entry);
}

if (isMain()) {
  const stories = loadStories();
  process.stdout.write(`${JSON.stringify(stories, null, 2)}\n`);
  process.stderr.write(`# ${stories.length} stories enumerated\n`);
}
