/**
 * Browser-side MSW worker for Ladle and any other web consumer.
 * Import as `import { worker } from '@absolute-ui/mocks/browser'`.
 *
 * Before this works in dev, run:
 *   pnpm --filter @absolute-ui/mocks exec msw init <public-dir>/ --save
 * to drop `mockServiceWorker.js` into the host app's public directory.
 */
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

export const worker = setupWorker(...handlers);
export { setupWorker };
