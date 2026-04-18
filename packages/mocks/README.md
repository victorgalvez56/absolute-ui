# @absolute-ui/mocks

Private workspace package. Centralizes MSW handlers consumed by:

- Vitest suites that need stable, deterministic API responses
- Ladle stories that demo data-fetching components in the browser
- Maestro flows on the example app once those land

## Entry points

- `@absolute-ui/mocks` — exports `handlers`, `API_BASE`, and the response types.
- `@absolute-ui/mocks/node` — exports `server = setupServer(...handlers)` for Vitest.
- `@absolute-ui/mocks/browser` — exports `worker = setupWorker(...handlers)` for Ladle.
- `@absolute-ui/mocks/vitest-setup` — opt-in `setupFiles` entry for package vitest configs.

## One-time service worker setup (Ladle)

The browser worker needs `mockServiceWorker.js` to live next to the host app's
served public assets. Generate it once per host app:

```bash
pnpm --filter @absolute-ui/mocks exec msw init ../../apps/ladle/public/ --save
```

Re-run after upgrading `msw` to refresh the worker file.

## Endpoints

| Method | URL                                       | Description                                                                |
| ------ | ----------------------------------------- | -------------------------------------------------------------------------- |
| GET    | `https://api.absolute-ui.dev/v1/feed`     | Paged artwork list, 3 pages × 8 deterministic items.                       |
| POST   | `https://api.absolute-ui.dev/v1/auth/sign-in` | 200 for `user@example.com / correct-horse`, else 401 `invalid_credentials`. |
| GET    | `https://api.absolute-ui.dev/v1/devices`  | Four AirPlay-style devices: active, available, offline, unreachable.       |
