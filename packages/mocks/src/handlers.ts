/**
 * Shared MSW handlers consumed by Vitest, Ladle, and Maestro flows.
 *
 * Endpoints are intentionally narrow and deterministic so snapshots stay
 * stable and tests don't need fixtures sprinkled across packages.
 */
import { http, HttpResponse } from 'msw';

export const API_BASE = 'https://api.absolute-ui.dev/v1';

export interface ArtworkItem {
  id: string;
  title: string;
  artist: string;
  colorHex: string;
}

export interface FeedPage {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  items: ArtworkItem[];
}

export interface AuthSuccess {
  token: string;
  user: { email: string; displayName: string };
}

export interface AuthError {
  code: 'invalid_credentials';
  message: string;
}

export type DeviceStatus = 'active' | 'available' | 'offline' | 'unreachable';

export interface Device {
  id: string;
  name: string;
  kind: 'speaker' | 'tv' | 'phone' | 'headphones';
  status: DeviceStatus;
  outputLevel: number;
}

const FEED_PAGE_SIZE = 8;
const FEED_TOTAL_PAGES = 3;
const FEED_TOTAL_ITEMS = FEED_PAGE_SIZE * FEED_TOTAL_PAGES;

const ARTISTS = [
  'Aria Solis',
  'Mira Voss',
  'Kenji Otsuka',
  'Lior Bram',
  'Nadia Cole',
  'Theo Aalto',
  'Ines Marchand',
  'Yuki Hara',
] as const;

const PALETTE = [
  '#0B1D3A',
  '#1F4068',
  '#3E5C76',
  '#9DB4C0',
  '#F0E6CC',
  '#C9A66B',
  '#A14A3A',
  '#5A1E2D',
] as const;

/**
 * Deterministic feed builder. Same inputs always produce the same items so
 * VRT snapshots and Maestro replays don't drift between runs.
 */
function buildFeedItems(page: number): ArtworkItem[] {
  const start = (page - 1) * FEED_PAGE_SIZE;
  return Array.from({ length: FEED_PAGE_SIZE }, (_, idx) => {
    const seed = start + idx;
    const artist = ARTISTS[seed % ARTISTS.length] ?? ARTISTS[0];
    const colorHex = PALETTE[seed % PALETTE.length] ?? PALETTE[0];
    return {
      id: `art_${String(seed + 1).padStart(3, '0')}`,
      title: `Composition №${seed + 1}`,
      artist: artist as string,
      colorHex: colorHex as string,
    };
  });
}

const VALID_EMAIL = 'user@example.com';
const VALID_PASSWORD = 'correct-horse';

const DEVICES: readonly Device[] = [
  {
    id: 'dev_living_room',
    name: 'Living Room',
    kind: 'speaker',
    status: 'active',
    outputLevel: 0.62,
  },
  {
    id: 'dev_kitchen',
    name: 'Kitchen HomePod',
    kind: 'speaker',
    status: 'available',
    outputLevel: 0,
  },
  {
    id: 'dev_bedroom_tv',
    name: 'Bedroom TV',
    kind: 'tv',
    status: 'offline',
    outputLevel: 0,
  },
  {
    id: 'dev_studio_buds',
    name: 'Studio Buds',
    kind: 'headphones',
    status: 'unreachable',
    outputLevel: 0,
  },
] as const;

export const handlers = [
  http.get(`${API_BASE}/feed`, ({ request }) => {
    const url = new URL(request.url);
    const rawPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.min(rawPage, FEED_TOTAL_PAGES) : 1;
    const body: FeedPage = {
      page,
      pageSize: FEED_PAGE_SIZE,
      totalPages: FEED_TOTAL_PAGES,
      totalItems: FEED_TOTAL_ITEMS,
      items: buildFeedItems(page),
    };
    return HttpResponse.json(body);
  }),

  http.post(`${API_BASE}/auth/sign-in`, async ({ request }) => {
    const payload = (await request.json().catch(() => null)) as {
      email?: unknown;
      password?: unknown;
    } | null;
    const email = typeof payload?.email === 'string' ? payload.email : '';
    const password = typeof payload?.password === 'string' ? payload.password : '';

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const body: AuthSuccess = {
        token: 'mock_session_token_v1',
        user: { email, displayName: 'Test User' },
      };
      return HttpResponse.json(body, { status: 200 });
    }

    const error: AuthError = {
      code: 'invalid_credentials',
      message: 'Email or password is incorrect.',
    };
    return HttpResponse.json(error, { status: 401 });
  }),

  http.get(`${API_BASE}/devices`, () => {
    return HttpResponse.json({ devices: DEVICES });
  }),
];
