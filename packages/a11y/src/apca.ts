import { parseHex } from './color.js';

// APCA / SAPC-G4g constants (Andrew Somers, public algorithm).
// Source of truth: https://github.com/Myndex/SAPC-APCA
const MAIN_TRC = 2.4;
const NORM_BG = 0.56;
const NORM_TXT = 0.57;
const REV_TXT = 0.62;
const REV_BG = 0.65;
const BLK_THRS = 0.022;
// biome-ignore lint/suspicious/noApproximativeNumericConstant: APCA spec constant, not Math.SQRT2
const BLK_CLMP = 1.414;
const SCALE_BOW = 1.14;
const SCALE_WOB = 1.14;
const LO_BOW_OFFSET = 0.027;
const LO_WOB_OFFSET = 0.027;
const LO_CLIP = 0.1;

function sRgbToY(hex: string): number {
  const { r, g, b } = parseHex(hex);
  return 0.2126729 * r ** MAIN_TRC + 0.7151522 * g ** MAIN_TRC + 0.072175 * b ** MAIN_TRC;
}

function softClampBlack(y: number): number {
  return y >= BLK_THRS ? y : y + (BLK_THRS - y) ** BLK_CLMP;
}

/**
 * APCA lightness contrast (Lc) between a foreground text color and
 * background color. Result ranges from about -108 (lightest text on
 * darkest background) to +106 (darkest text on lightest background).
 * Returns 0 for contrasts below the noise floor.
 */
export function apcaContrast(text: string, background: string): number {
  const yTxt = softClampBlack(sRgbToY(text));
  const yBg = softClampBlack(sRgbToY(background));

  let sapc = 0;
  if (yBg > yTxt) {
    // Normal polarity: dark text on light background.
    sapc = (yBg ** NORM_BG - yTxt ** NORM_TXT) * SCALE_BOW;
    if (sapc < LO_CLIP) return 0;
    return (sapc - LO_BOW_OFFSET) * 100;
  }
  // Reverse polarity: light text on dark background.
  sapc = (yBg ** REV_BG - yTxt ** REV_TXT) * SCALE_WOB;
  if (sapc > -LO_CLIP) return 0;
  return (sapc + LO_WOB_OFFSET) * 100;
}

/**
 * Absolute UI body-text contract on glass surfaces. Minimum Lc 60 in
 * absolute value — a stricter floor than WCAG 2.x 4.5:1, chosen so
 * translucent recipes remain readable under real photographic backdrops.
 */
export const MIN_BODY_LC = 60;

export function meetsContrast(text: string, background: string, minLc = MIN_BODY_LC): boolean {
  return Math.abs(apcaContrast(text, background)) >= minLc;
}
