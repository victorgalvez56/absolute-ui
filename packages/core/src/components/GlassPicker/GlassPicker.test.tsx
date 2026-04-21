import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, renderWithTheme } from '../../test-utils/render.js';
import { GlassPicker, type GlassPickerItem } from './GlassPicker.js';

afterEach(cleanup);

const ITEMS: readonly GlassPickerItem<string>[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

/**
 * Pick a radio by its accessibility label. Throws if absent so the
 * failure message carries the missing label — cheaper to debug than
 * a `!`-then-undefined runtime error.
 */
function radio(radios: HTMLElement[], label: string): HTMLElement {
  const el = radios.find((r) => r.getAttribute('aria-label') === label);
  if (!el) throw new Error(`No radio with aria-label="${label}"`);
  return el;
}

describe('GlassPicker — rendering', () => {
  test('renders every segment label', () => {
    const { getByText } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="week" onValueChange={() => {}} />,
    );
    expect(getByText('Day')).toBeTruthy();
    expect(getByText('Week')).toBeTruthy();
    expect(getByText('Month')).toBeTruthy();
  });

  test('renders the optional group label above the row', () => {
    const { getByText } = renderWithTheme(
      <GlassPicker label="Range" items={ITEMS} defaultValue="day" onValueChange={() => {}} />,
    );
    expect(getByText('Range')).toBeTruthy();
  });
});

describe('GlassPicker — accessibility', () => {
  test('container has role="radiogroup"', () => {
    const { getByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="day" onValueChange={() => {}} />,
    );
    expect(getByRole('radiogroup')).toBeTruthy();
  });

  test('each segment has role="radio"', () => {
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="day" onValueChange={() => {}} />,
    );
    expect(getAllByRole('radio').length).toBe(ITEMS.length);
  });

  test('selected segment renders its label bolder than unselected siblings', () => {
    // RN-web 0.21 does not emit aria-checked for role=radio, so we
    // verify the visible selection cue: the pure helper bumps the
    // selected segment's fontWeight from 500 → 600.
    const { getByText } = renderWithTheme(
      <GlassPicker items={ITEMS} value="week" onValueChange={() => {}} />,
    );
    const weekText = getByText('Week');
    const dayText = getByText('Day');
    expect(weekText.style.fontWeight).toBe('600');
    expect(dayText.style.fontWeight).toBe('500');
  });

  test('disabled group propagates aria-disabled=true to every segment', () => {
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} disabled defaultValue="day" onValueChange={() => {}} />,
    );
    const radios = getAllByRole('radio');
    for (const r of radios) {
      expect(r.getAttribute('aria-disabled')).toBe('true');
    }
  });

  test('per-item disabled flag marks only that segment aria-disabled', () => {
    const items: readonly GlassPickerItem<string>[] = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week', disabled: true },
      { value: 'month', label: 'Month' },
    ];
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={items} defaultValue="day" onValueChange={() => {}} />,
    );
    const byLabel = Object.fromEntries(
      getAllByRole('radio').map((r) => [r.getAttribute('aria-label'), r] as const),
    );
    expect(byLabel.Week?.getAttribute('aria-disabled')).toBe('true');
    expect(byLabel.Day?.getAttribute('aria-disabled')).not.toBe('true');
    expect(byLabel.Month?.getAttribute('aria-disabled')).not.toBe('true');
  });
});

describe('GlassPicker — interaction', () => {
  test('tapping a segment fires onValueChange with that value', () => {
    const onValueChange = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="day" onValueChange={onValueChange} />,
    );
    fireEvent.click(radio(getAllByRole('radio'), 'Week'));
    expect(onValueChange).toHaveBeenCalledWith('week');
  });

  test('tapping the already-selected segment is a no-op', () => {
    const onValueChange = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="day" onValueChange={onValueChange} />,
    );
    fireEvent.click(radio(getAllByRole('radio'), 'Day'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test('uncontrolled: pressing updates the internal selected state', () => {
    const { getAllByRole, getByText } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="day" onValueChange={() => {}} />,
    );
    expect(getByText('Day').style.fontWeight).toBe('600');
    fireEvent.click(radio(getAllByRole('radio'), 'Week'));
    expect(getByText('Week').style.fontWeight).toBe('600');
    expect(getByText('Day').style.fontWeight).toBe('500');
  });

  test('disabled group blocks selection', () => {
    const onValueChange = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} disabled defaultValue="day" onValueChange={onValueChange} />,
    );
    fireEvent.click(radio(getAllByRole('radio'), 'Week'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test('per-item disabled blocks that segment only', () => {
    const onValueChange = vi.fn();
    const items: readonly GlassPickerItem<string>[] = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week', disabled: true },
      { value: 'month', label: 'Month' },
    ];
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={items} defaultValue="day" onValueChange={onValueChange} />,
    );
    const radios = getAllByRole('radio');
    fireEvent.click(radio(radios, 'Week'));
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.click(radio(radios, 'Month'));
    expect(onValueChange).toHaveBeenCalledWith('month');
  });
});

describe('GlassPicker — keyboard', () => {
  test('ArrowRight selects the next enabled segment', () => {
    const onValueChange = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="day" onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(radio(getAllByRole('radio'), 'Day'), { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith('week');
  });

  test('ArrowLeft wraps from the first to the last segment', () => {
    const onValueChange = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="day" onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(radio(getAllByRole('radio'), 'Day'), { key: 'ArrowLeft' });
    expect(onValueChange).toHaveBeenCalledWith('month');
  });

  test('Home jumps to the first enabled segment', () => {
    const onValueChange = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="month" onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(radio(getAllByRole('radio'), 'Month'), { key: 'Home' });
    expect(onValueChange).toHaveBeenCalledWith('day');
  });

  test('End jumps to the last enabled segment', () => {
    const onValueChange = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={ITEMS} defaultValue="day" onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(radio(getAllByRole('radio'), 'Day'), { key: 'End' });
    expect(onValueChange).toHaveBeenCalledWith('month');
  });

  test('ArrowRight skips disabled items', () => {
    const onValueChange = vi.fn();
    const items: readonly GlassPickerItem<string>[] = [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week', disabled: true },
      { value: 'month', label: 'Month' },
    ];
    const { getAllByRole } = renderWithTheme(
      <GlassPicker items={items} defaultValue="day" onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(radio(getAllByRole('radio'), 'Day'), { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith('month');
  });
});
