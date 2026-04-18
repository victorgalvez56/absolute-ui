/**
 * Barrel for shared MSW handlers and helpers.
 *
 * The submodule entries (`@absolute-ui/mocks/node`, `@absolute-ui/mocks/browser`)
 * are exposed via `exports` in package.json so consumers tree-shake the
 * platform-specific MSW imports they don't need.
 */
export {
  API_BASE,
  handlers,
  type ArtworkItem,
  type AuthError,
  type AuthSuccess,
  type Device,
  type DeviceStatus,
  type FeedPage,
} from './handlers.js';
