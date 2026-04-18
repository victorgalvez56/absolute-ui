import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { API_BASE, type AuthError, type AuthSuccess, type Device, type FeedPage } from './index.js';
import { server } from './node.js';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('GET /v1/feed', () => {
  test('returns the first page by default with 8 deterministic items', async () => {
    const res = await fetch(`${API_BASE}/feed`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as FeedPage;
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(8);
    expect(body.totalPages).toBe(3);
    expect(body.totalItems).toBe(24);
    expect(body.items).toHaveLength(8);
    expect(body.items[0]).toEqual({
      id: 'art_001',
      title: 'Composition №1',
      artist: 'Aria Solis',
      colorHex: '#0B1D3A',
    });
  });

  test('honors the page query param and returns matching items', async () => {
    const res = await fetch(`${API_BASE}/feed?page=2`);
    const body = (await res.json()) as FeedPage;
    expect(body.page).toBe(2);
    expect(body.items).toHaveLength(8);
    expect(body.items[0]?.id).toBe('art_009');
  });

  test('clamps out-of-range pages to the last page', async () => {
    const res = await fetch(`${API_BASE}/feed?page=99`);
    const body = (await res.json()) as FeedPage;
    expect(body.page).toBe(3);
    expect(body.items[7]?.id).toBe('art_024');
  });

  test('produces deterministic output across calls', async () => {
    const a = (await (await fetch(`${API_BASE}/feed?page=2`)).json()) as FeedPage;
    const b = (await (await fetch(`${API_BASE}/feed?page=2`)).json()) as FeedPage;
    expect(a).toEqual(b);
  });
});

describe('POST /v1/auth/sign-in', () => {
  test('returns 200 + token for the valid credential pair', async () => {
    const res = await fetch(`${API_BASE}/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'correct-horse' }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as AuthSuccess;
    expect(body.token).toBe('mock_session_token_v1');
    expect(body.user.email).toBe('user@example.com');
  });

  test('returns 401 + invalid_credentials for a wrong password', async () => {
    const res = await fetch(`${API_BASE}/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'nope' }),
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as AuthError;
    expect(body.code).toBe('invalid_credentials');
  });

  test('returns 401 when the body is malformed', async () => {
    const res = await fetch(`${API_BASE}/auth/sign-in`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'not-json',
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as AuthError;
    expect(body.code).toBe('invalid_credentials');
  });
});

describe('GET /v1/devices', () => {
  test('returns the four AirPlay-style devices with the expected statuses', async () => {
    const res = await fetch(`${API_BASE}/devices`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as { devices: Device[] };
    expect(body.devices).toHaveLength(4);
    const statuses = body.devices.map((d) => d.status).sort();
    expect(statuses).toEqual(['active', 'available', 'offline', 'unreachable']);
    const active = body.devices.find((d) => d.status === 'active');
    expect(active?.id).toBe('dev_living_room');
    expect(active?.outputLevel).toBeGreaterThan(0);
  });
});
