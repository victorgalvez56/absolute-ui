import { worker } from '@absolute-ui/mocks/browser';
/**
 * Ladle global Provider — wraps every story.
 *
 * In dev, we boot the shared MSW worker from `@absolute-ui/mocks/browser`
 * so stories that fetch from `https://api.absolute-ui.dev/v1/*` get
 * deterministic responses without touching a real network.
 *
 * One-time setup (re-run after upgrading `msw`):
 *   pnpm --filter @absolute-ui/ladle mocks:init
 *
 * That copies `mockServiceWorker.js` into `apps/ladle/public/` so Vite
 * serves it at `/mockServiceWorker.js`. Without that file the worker
 * registration logs a 404 and silently bypasses every request.
 */
import type { GlobalProvider } from '@ladle/react';
import { useEffect, useState } from 'react';

let workerStartPromise: Promise<unknown> | null = null;

function startWorkerOnce(): Promise<unknown> {
  if (workerStartPromise) return workerStartPromise;
  workerStartPromise = worker
    .start({
      serviceWorker: { url: '/mockServiceWorker.js' },
      onUnhandledRequest: 'bypass',
    })
    .catch((err: unknown) => {
      // Surface the failure but don't block stories that don't depend on mocks.
      // eslint-disable-next-line no-console
      console.warn('[absolute-ui/mocks] worker failed to start', err);
    });
  return workerStartPromise;
}

// Vite stamps `import.meta.env.DEV` at build time. Cast locally so we don't
// have to add `vite/client` to the workspace tsconfig just for this file.
const IS_DEV = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV ?? false;

export const Provider: GlobalProvider = ({ children }) => {
  const [ready, setReady] = useState(!IS_DEV);

  useEffect(() => {
    if (!IS_DEV) return;
    let cancelled = false;
    startWorkerOnce().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
};
