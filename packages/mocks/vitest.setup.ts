/**
 * Opt-in Vitest setup for packages that exercise mocked endpoints.
 *
 * To use, add this path to a package's vitest config `setupFiles`:
 *   setupFiles: ['../mocks/vitest.setup.ts']
 *
 * It boots the shared MSW server before the suite, resets handler state
 * between tests so per-test overrides don't leak, and tears down at the end.
 */
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './src/node.js';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
