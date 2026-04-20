import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, renderWithTheme } from '../../test-utils/render.js';
import { GlassSlider } from './GlassSlider.js';

afterEach(cleanup);

/**
 * RN-web maps accessibilityRole="adjustable" → DOM role="slider". Grab
 * the matching element or throw — a missing slider is a render failure
 * and the thrown error points directly at the broken contract.
 */
function sliderIn(container: HTMLElement): HTMLElement {
  const el = container.querySelector('[role="slider"]');
  if (!el) throw new Error('No role="slider" element found in container');
  return el as HTMLElement;
}

describe('GlassSlider — rendering', () => {
  test('renders the visible label', () => {
    const { getByText } = renderWithTheme(
      <GlassSlider label="Volume" defaultValue={50} onValueChange={() => {}} />,
    );
    expect(getByText('Volume')).toBeTruthy();
  });

  test('renders the value readout when formatValue is supplied', () => {
    const { getByText } = renderWithTheme(
      <GlassSlider
        label="Volume"
        defaultValue={42}
        formatValue={(v) => `${v}%`}
        onValueChange={() => {}}
      />,
    );
    expect(getByText('42%')).toBeTruthy();
  });

  test('showValue=false hides the readout even when formatValue is provided', () => {
    const { queryByText } = renderWithTheme(
      <GlassSlider
        label="Volume"
        defaultValue={42}
        formatValue={(v) => `${v}%`}
        showValue={false}
        onValueChange={() => {}}
      />,
    );
    expect(queryByText('42%')).toBeNull();
  });

  test('clamps defaultValue into [min, max]', () => {
    // defaultValue 200 > max 100 should render the readout at 100
    const { getByText } = renderWithTheme(
      <GlassSlider
        defaultValue={200}
        minimumValue={0}
        maximumValue={100}
        formatValue={(v) => `${v}`}
        onValueChange={() => {}}
      />,
    );
    expect(getByText('100')).toBeTruthy();
  });
});

describe('GlassSlider — accessibility', () => {
  test('Pressable has role="adjustable" (→ slider)', () => {
    const { container } = renderWithTheme(
      <GlassSlider label="Volume" defaultValue={50} onValueChange={() => {}} />,
    );
    // RN-web maps accessibilityRole="adjustable" → role="slider"
    expect(container.querySelector('[role="slider"]')).toBeTruthy();
  });

  test('label doubles as the accessibility label', () => {
    const { getByLabelText } = renderWithTheme(
      <GlassSlider label="Brightness" defaultValue={50} onValueChange={() => {}} />,
    );
    expect(getByLabelText('Brightness')).toBeTruthy();
  });

  test('accessibilityLabel overrides the visible label', () => {
    const { getByLabelText } = renderWithTheme(
      <GlassSlider
        label="🔆"
        accessibilityLabel="Brightness"
        defaultValue={50}
        onValueChange={() => {}}
      />,
    );
    expect(getByLabelText('Brightness')).toBeTruthy();
  });

  test('disabled flag propagates aria-disabled=true', () => {
    const { container } = renderWithTheme(
      <GlassSlider label="Volume" disabled defaultValue={50} onValueChange={() => {}} />,
    );
    const slider = container.querySelector('[role="slider"]');
    expect(slider?.getAttribute('aria-disabled')).toBe('true');
  });

  test('decorative (no handler) announces as disabled', () => {
    const { container } = renderWithTheme(<GlassSlider label="Volume" defaultValue={50} />);
    const slider = container.querySelector('[role="slider"]');
    expect(slider?.getAttribute('aria-disabled')).toBe('true');
  });
});

describe('GlassSlider — keyboard', () => {
  test('ArrowRight increments by step', () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassSlider label="Volume" defaultValue={50} step={1} onValueChange={onValueChange} />,
    );
    const slider = container.querySelector('[role="slider"]') as HTMLElement;
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith(51);
  });

  test('ArrowLeft decrements by step', () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassSlider label="Volume" defaultValue={50} step={1} onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(sliderIn(container), { key: 'ArrowLeft' });
    expect(onValueChange).toHaveBeenCalledWith(49);
  });

  test('Home jumps to min', () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassSlider
        label="Volume"
        defaultValue={50}
        minimumValue={0}
        maximumValue={100}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.keyDown(sliderIn(container), { key: 'Home' });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  test('End jumps to max', () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassSlider
        label="Volume"
        defaultValue={50}
        minimumValue={0}
        maximumValue={100}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.keyDown(sliderIn(container), { key: 'End' });
    expect(onValueChange).toHaveBeenCalledWith(100);
  });

  test('PageUp increments by 10x step', () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassSlider label="Volume" defaultValue={50} step={1} onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(sliderIn(container), { key: 'PageUp' });
    expect(onValueChange).toHaveBeenCalledWith(60);
  });

  test('non-arrow keys are ignored', () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassSlider label="Volume" defaultValue={50} onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(sliderIn(container), { key: 'a' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test('disabled slider ignores keyboard input', () => {
    const onValueChange = vi.fn();
    const { container } = renderWithTheme(
      <GlassSlider label="Volume" disabled defaultValue={50} onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(sliderIn(container), { key: 'ArrowRight' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test('readout updates when keyboard advances the value', () => {
    const { container, getByText } = renderWithTheme(
      <GlassSlider
        label="Volume"
        defaultValue={50}
        formatValue={(v) => `${v}%`}
        onValueChange={() => {}}
      />,
    );
    fireEvent.keyDown(sliderIn(container), { key: 'ArrowRight' });
    expect(getByText('51%')).toBeTruthy();
  });
});

describe('GlassSlider — controlled vs uncontrolled', () => {
  test('controlled: prop changes update the readout without user input', () => {
    const { getByText, rerender } = renderWithTheme(
      <GlassSlider
        label="Volume"
        value={30}
        formatValue={(v) => `${v}%`}
        onValueChange={() => {}}
      />,
    );
    expect(getByText('30%')).toBeTruthy();
    rerender(
      <GlassSlider
        label="Volume"
        value={80}
        formatValue={(v) => `${v}%`}
        onValueChange={() => {}}
      />,
    );
    expect(getByText('80%')).toBeTruthy();
  });

  test('controlled: keyboard fires onValueChange but does not mutate visible value', () => {
    const onValueChange = vi.fn();
    const { container, getByText } = renderWithTheme(
      <GlassSlider
        label="Volume"
        value={30}
        formatValue={(v) => `${v}%`}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.keyDown(sliderIn(container), { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith(31);
    // value prop still 30 — readout stays at 30%
    expect(getByText('30%')).toBeTruthy();
  });
});
