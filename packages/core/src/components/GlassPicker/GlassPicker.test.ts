/**
 * GlassPicker unit tests — pure helpers only. JSX wiring (Pressable,
 * onKeyDown event plumbing) is covered by Ladle interaction tests
 * later, same split the rest of Phase 3 uses.
 */
import { aurora, frost, obsidian, sunset } from '@absolute-ui/tokens';
import { describe, expect, test } from 'vitest';
import {
  FOCUS_RING_OFFSET,
  FOCUS_RING_WIDTH,
  type GlassPickerItem,
  MIN_HIT_TARGET,
  buildGlassPickerContainerStyle,
  buildGlassPickerLabelStyle,
  buildGlassPickerSegmentStyle,
  buildGlassPickerSegmentTextStyle,
  deriveNextPickerIndexFromKey,
  isGlassPickerInteractive,
  isGlassPickerSegmentInteractive,
  keyPressMovedPickerIndex,
  resolveGlassPickerAccessibilityLabel,
  resolveGlassPickerSegmentAccessibilityState,
  resolveSelectedIndex,
} from './style.js';

const FOCUS = '#A6F0E0';
const SELECTED = '#4FD3B5';
const UNSELECTED = 'transparent';
const TRACK = '#2C2F3A';

const items: readonly GlassPickerItem<string>[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

describe('resolveSelectedIndex', () => {
  test('returns the matching index for a present value', () => {
    expect(resolveSelectedIndex({ items, selectedValue: 'week' })).toBe(1);
  });

  test('returns -1 when no item matches', () => {
    expect(resolveSelectedIndex({ items, selectedValue: 'year' })).toBe(-1);
  });

  test('returns -1 when the selected value is undefined', () => {
    expect(resolveSelectedIndex({ items, selectedValue: undefined })).toBe(-1);
  });

  test('uses strict equality (numeric vs string)', () => {
    const numericItems: readonly GlassPickerItem<number>[] = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];
    expect(resolveSelectedIndex({ items: numericItems, selectedValue: 1 })).toBe(0);
  });
});

describe('isGlassPickerInteractive', () => {
  test('requires both a handler and non-disabled', () => {
    expect(isGlassPickerInteractive({ disabled: false, hasOnValueChange: true })).toBe(true);
    expect(isGlassPickerInteractive({ disabled: true, hasOnValueChange: true })).toBe(false);
    expect(isGlassPickerInteractive({ disabled: false, hasOnValueChange: false })).toBe(false);
  });
});

describe('isGlassPickerSegmentInteractive', () => {
  test('group interactive + item enabled → true', () => {
    expect(
      isGlassPickerSegmentInteractive({
        groupInteractive: true,
        item: items[0] as GlassPickerItem<string>,
      }),
    ).toBe(true);
  });

  test('group non-interactive overrides item enabled', () => {
    expect(
      isGlassPickerSegmentInteractive({
        groupInteractive: false,
        item: items[0] as GlassPickerItem<string>,
      }),
    ).toBe(false);
  });

  test('item-level disabled wins even when group is interactive', () => {
    const disabledItem: GlassPickerItem<string> = {
      value: 'quarter',
      label: 'Quarter',
      disabled: true,
    };
    expect(isGlassPickerSegmentInteractive({ groupInteractive: true, item: disabledItem })).toBe(
      false,
    );
  });
});

describe('buildGlassPickerContainerStyle', () => {
  test('idle group is fully opaque', () => {
    expect(
      buildGlassPickerContainerStyle({ disabled: false, backgroundColor: TRACK }).opacity,
    ).toBe(1);
  });

  test('disabled group dims to 0.4', () => {
    expect(buildGlassPickerContainerStyle({ disabled: true, backgroundColor: TRACK }).opacity).toBe(
      0.4,
    );
  });

  test('forwards the backplate color', () => {
    expect(
      buildGlassPickerContainerStyle({ disabled: false, backgroundColor: TRACK }).backgroundColor,
    ).toBe(TRACK);
  });
});

describe('buildGlassPickerSegmentStyle', () => {
  const base = {
    selectedColor: SELECTED,
    unselectedColor: UNSELECTED,
    focusRingColor: FOCUS,
  };

  test('selected segment paints the selectedColor', () => {
    const s = buildGlassPickerSegmentStyle({
      selected: true,
      disabled: false,
      focused: false,
      ...base,
    });
    expect(s.backgroundColor).toBe(SELECTED);
  });

  test('unselected segment paints the unselectedColor', () => {
    expect(
      buildGlassPickerSegmentStyle({
        selected: false,
        disabled: false,
        focused: false,
        ...base,
      }).backgroundColor,
    ).toBe(UNSELECTED);
  });

  test('disabled segment dims and suppresses the focus ring', () => {
    const s = buildGlassPickerSegmentStyle({
      selected: true,
      disabled: true,
      focused: true,
      ...base,
    });
    expect(s.opacity).toBe(0.5);
    expect(s.outlineStyle).toBe('none');
    expect(s.outlineWidth).toBe(0);
  });

  test('focused + not disabled paints the focus ring', () => {
    const s = buildGlassPickerSegmentStyle({
      selected: false,
      disabled: false,
      focused: true,
      ...base,
    });
    expect(s.outlineStyle).toBe('solid');
    expect(s.outlineWidth).toBe(FOCUS_RING_WIDTH);
    expect(s.outlineColor).toBe(FOCUS);
    expect(s.outlineOffset).toBe(FOCUS_RING_OFFSET);
  });

  test('flex=1 so siblings share available width evenly', () => {
    const s = buildGlassPickerSegmentStyle({
      selected: false,
      disabled: false,
      focused: false,
      ...base,
    });
    expect(s.flex).toBe(1);
  });

  test('minHeight + outer padding clears 44dp on the full row', () => {
    const s = buildGlassPickerSegmentStyle({
      selected: false,
      disabled: false,
      focused: false,
      ...base,
    });
    // container has 4dp padding top + 4dp bottom, so segment floor
    // of MIN_HIT_TARGET - 8 sums to exactly MIN_HIT_TARGET
    expect(s.minHeight + 8).toBe(MIN_HIT_TARGET);
  });
});

describe('segment + label text styles across personalities', () => {
  const themes = [
    ['aurora', aurora],
    ['obsidian', obsidian],
    ['frost', frost],
    ['sunset', sunset],
  ] as const;

  test.each(themes)(
    '%s selected uses onAccent (bolder), unselected uses textPrimary',
    (_name, theme) => {
      const selected = buildGlassPickerSegmentTextStyle({
        selected: true,
        selectedTextColor: theme.colors.onAccent,
        unselectedTextColor: theme.colors.textPrimary,
      });
      const unselected = buildGlassPickerSegmentTextStyle({
        selected: false,
        selectedTextColor: theme.colors.onAccent,
        unselectedTextColor: theme.colors.textPrimary,
      });
      expect(selected.color).toBe(theme.colors.onAccent);
      expect(selected.fontWeight).toBe('600');
      expect(unselected.color).toBe(theme.colors.textPrimary);
      expect(unselected.fontWeight).toBe('500');
    },
  );

  test.each(themes)('%s label uses textPrimary', (_name, theme) => {
    const s = buildGlassPickerLabelStyle(theme.colors.textPrimary);
    expect(s.color).toBe(theme.colors.textPrimary);
    expect(s.fontWeight).toBe('600');
  });
});

describe('deriveNextPickerIndexFromKey (WAI-ARIA radio pattern)', () => {
  test('ArrowRight / ArrowDown advance by one', () => {
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowRight', currentIndex: 0, items })).toBe(1);
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowDown', currentIndex: 1, items })).toBe(2);
  });

  test('ArrowLeft / ArrowUp retreat by one', () => {
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowLeft', currentIndex: 2, items })).toBe(1);
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowUp', currentIndex: 1, items })).toBe(0);
  });

  test('Home / End jump to the first / last enabled items', () => {
    expect(deriveNextPickerIndexFromKey({ key: 'Home', currentIndex: 2, items })).toBe(0);
    expect(deriveNextPickerIndexFromKey({ key: 'End', currentIndex: 0, items })).toBe(2);
  });

  test('wraps around both ends', () => {
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowRight', currentIndex: 2, items })).toBe(0);
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowLeft', currentIndex: 0, items })).toBe(2);
  });

  test('skips disabled items while navigating', () => {
    const mixed: readonly GlassPickerItem<string>[] = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
      { value: 'c', label: 'C' },
    ];
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowRight', currentIndex: 0, items: mixed })).toBe(
      2,
    );
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowLeft', currentIndex: 2, items: mixed })).toBe(
      0,
    );
  });

  test('Home / End respect disabled items', () => {
    const mixed: readonly GlassPickerItem<string>[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' },
      { value: 'd', label: 'D', disabled: true },
    ];
    expect(deriveNextPickerIndexFromKey({ key: 'Home', currentIndex: 2, items: mixed })).toBe(1);
    expect(deriveNextPickerIndexFromKey({ key: 'End', currentIndex: 1, items: mixed })).toBe(2);
  });

  test('jumps to first enabled when current index is disabled / unset', () => {
    const mixed: readonly GlassPickerItem<string>[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
    ];
    expect(
      deriveNextPickerIndexFromKey({ key: 'ArrowRight', currentIndex: -1, items: mixed }),
    ).toBe(1);
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowLeft', currentIndex: -1, items: mixed })).toBe(
      1,
    );
  });

  test('unrecognized keys return the current index', () => {
    expect(deriveNextPickerIndexFromKey({ key: 'Enter', currentIndex: 1, items })).toBe(1);
    expect(deriveNextPickerIndexFromKey({ key: 'Tab', currentIndex: 1, items })).toBe(1);
  });

  test('empty item list returns -1', () => {
    expect(deriveNextPickerIndexFromKey({ key: 'ArrowRight', currentIndex: -1, items: [] })).toBe(
      -1,
    );
  });

  test('every item disabled → returns current index unchanged', () => {
    const allDisabled: readonly GlassPickerItem<string>[] = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B', disabled: true },
    ];
    expect(
      deriveNextPickerIndexFromKey({ key: 'ArrowRight', currentIndex: 0, items: allDisabled }),
    ).toBe(0);
  });
});

describe('keyPressMovedPickerIndex', () => {
  test('true when the key produced a different index', () => {
    expect(keyPressMovedPickerIndex({ key: 'ArrowRight', currentIndex: 0, items })).toBe(true);
  });

  test('false for unhandled keys', () => {
    expect(keyPressMovedPickerIndex({ key: 'Tab', currentIndex: 0, items })).toBe(false);
  });

  test('false when every item is disabled', () => {
    const allDisabled: readonly GlassPickerItem<string>[] = [
      { value: 'a', label: 'A', disabled: true },
    ];
    expect(
      keyPressMovedPickerIndex({ key: 'ArrowRight', currentIndex: 0, items: allDisabled }),
    ).toBe(false);
  });
});

describe('resolveGlassPickerAccessibilityLabel', () => {
  test('explicit override > visible label > undefined', () => {
    expect(
      resolveGlassPickerAccessibilityLabel({
        accessibilityLabel: 'Calendar range',
        label: 'Range',
      }),
    ).toBe('Calendar range');
    expect(
      resolveGlassPickerAccessibilityLabel({ accessibilityLabel: undefined, label: 'Range' }),
    ).toBe('Range');
    expect(
      resolveGlassPickerAccessibilityLabel({ accessibilityLabel: undefined, label: undefined }),
    ).toBeUndefined();
  });

  test('empty string label is respected', () => {
    expect(resolveGlassPickerAccessibilityLabel({ accessibilityLabel: '', label: 'Range' })).toBe(
      '',
    );
  });
});

describe('resolveGlassPickerSegmentAccessibilityState', () => {
  test('selected, group interactive, item enabled → checked+selected, not disabled', () => {
    expect(
      resolveGlassPickerSegmentAccessibilityState({
        selected: true,
        groupInteractive: true,
        itemDisabled: false,
      }),
    ).toEqual({ checked: true, selected: true, disabled: false });
  });

  test('group non-interactive collapses all segments to disabled', () => {
    expect(
      resolveGlassPickerSegmentAccessibilityState({
        selected: true,
        groupInteractive: false,
        itemDisabled: false,
      }),
    ).toEqual({ checked: true, selected: true, disabled: true });
  });

  test('item-level disabled wins even when group is interactive', () => {
    expect(
      resolveGlassPickerSegmentAccessibilityState({
        selected: false,
        groupInteractive: true,
        itemDisabled: true,
      }),
    ).toEqual({ checked: false, selected: false, disabled: true });
  });
});
