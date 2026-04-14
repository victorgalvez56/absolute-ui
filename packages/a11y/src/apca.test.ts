import { describe, expect, test } from 'vitest';
import { apcaContrast, meetsContrast } from './apca.js';

describe('apcaContrast', () => {
  test('black text on white background has high positive Lc', () => {
    const lc = apcaContrast('#000000', '#FFFFFF');
    expect(lc).toBeGreaterThan(100);
  });

  test('white text on black background has high negative Lc', () => {
    const lc = apcaContrast('#FFFFFF', '#000000');
    expect(lc).toBeLessThan(-100);
  });

  test('same color returns zero (below noise floor)', () => {
    expect(apcaContrast('#888888', '#888888')).toBe(0);
  });

  test('parses hex with and without leading hash', () => {
    const withHash = apcaContrast('#000000', '#FFFFFF');
    const withoutHash = apcaContrast('000000', 'FFFFFF');
    expect(withHash).toBe(withoutHash);
  });

  test('reverses sign when foreground and background swap', () => {
    const bow = apcaContrast('#111111', '#EEEEEE');
    const wob = apcaContrast('#EEEEEE', '#111111');
    expect(Math.sign(bow)).toBe(1);
    expect(Math.sign(wob)).toBe(-1);
  });
});

describe('meetsContrast', () => {
  test('black on white passes body-text threshold', () => {
    expect(meetsContrast('#000000', '#FFFFFF')).toBe(true);
  });

  test('mid-gray on white fails body-text threshold', () => {
    expect(meetsContrast('#999999', '#FFFFFF')).toBe(false);
  });

  test('honors custom minimum Lc', () => {
    expect(meetsContrast('#333333', '#FFFFFF', 30)).toBe(true);
  });
});
