/**
 * Node-side MSW server for Vitest and other Node consumers.
 * Import as `import { server } from '@absolute-ui/mocks/node'`.
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers.js';

export const server = setupServer(...handlers);
export { setupServer };
