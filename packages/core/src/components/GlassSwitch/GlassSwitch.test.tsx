import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, renderWithTheme } from '../../test-utils/render.js';
import { GlassSwitch } from './GlassSwitch.js';

afterEach(cleanup);

describe('GlassSwitch — rendering', () => {
  test('renders the visible label', () => {
    const { getByText } = renderWithTheme(
      <GlassSwitch label="Wi-Fi" defaultValue={false} onValueChange={() => {}} />,
    );
    expect(getByText('Wi-Fi')).toBeTruthy();
  });

  test('renders without a label', () => {
    expect(() =>
      renderWithTheme(<GlassSwitch defaultValue={false} onValueChange={() => {}} />),
    ).not.toThrow();
  });
});

describe('GlassSwitch — accessibility', () => {
  test('Pressable has role="switch"', () => {
    const { getByRole } = renderWithTheme(
      <GlassSwitch label="Wi-Fi" defaultValue={false} onValueChange={() => {}} />,
    );
    expect(getByRole('switch')).toBeTruthy();
  });

  test('checked state is reflected in the track background color', () => {
    // RN-web does not emit aria-checked on role=switch, so we verify
    // the state via the themed track background (divider → accent).
    const { getByRole, rerender } = renderWithTheme(
      <GlassSwitch label="Wi-Fi" value={false} onValueChange={() => {}} />,
    );
    const uncheckedBg = getByRole('switch').style.backgroundColor;

    rerender(<GlassSwitch label="Wi-Fi" value={true} onValueChange={() => {}} />);
    const checkedBg = getByRole('switch').style.backgroundColor;

    expect(uncheckedBg).not.toBe(checkedBg);
  });

  test('label doubles as the accessibility label when no override', () => {
    const { getByLabelText } = renderWithTheme(
      <GlassSwitch label="Airplane mode" defaultValue={false} onValueChange={() => {}} />,
    );
    expect(getByLabelText('Airplane mode')).toBeTruthy();
  });

  test('accessibilityLabel overrides the visible label', () => {
    const { getByLabelText, queryByLabelText } = renderWithTheme(
      <GlassSwitch
        label="📶"
        accessibilityLabel="Wi-Fi"
        defaultValue={false}
        onValueChange={() => {}}
      />,
    );
    expect(getByLabelText('Wi-Fi')).toBeTruthy();
    expect(queryByLabelText('📶')).toBeNull();
  });

  test('disabled announces aria-disabled=true', () => {
    const { getByRole } = renderWithTheme(
      <GlassSwitch label="Locked" disabled defaultValue={false} onValueChange={() => {}} />,
    );
    // RN-web maps accessibilityState.disabled → aria-disabled
    expect(getByRole('switch').getAttribute('aria-disabled')).toBe('true');
  });

  test('decorative switch (no handler) announces as disabled', () => {
    const { getByRole } = renderWithTheme(<GlassSwitch label="Read-only" defaultValue={true} />);
    expect(getByRole('switch').getAttribute('aria-disabled')).toBe('true');
  });
});

describe('GlassSwitch — interaction', () => {
  test('uncontrolled: pressing toggles the internal state', () => {
    const onValueChange = vi.fn();
    const { getByRole } = renderWithTheme(
      <GlassSwitch label="Wi-Fi" defaultValue={false} onValueChange={onValueChange} />,
    );
    const beforeBg = getByRole('switch').style.backgroundColor;
    fireEvent.click(getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
    // Track background flips to the accent color after the internal state updates.
    expect(getByRole('switch').style.backgroundColor).not.toBe(beforeBg);
  });

  test('controlled: onValueChange fires but visible state follows the prop', () => {
    const onValueChange = vi.fn();
    const { getByRole } = renderWithTheme(
      <GlassSwitch label="Wi-Fi" value={false} onValueChange={onValueChange} />,
    );
    const beforeBg = getByRole('switch').style.backgroundColor;
    fireEvent.click(getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
    // Parent hasn't bumped `value`, so the track stays unchecked.
    expect(getByRole('switch').style.backgroundColor).toBe(beforeBg);
  });

  test('disabled blocks onValueChange from firing', () => {
    const onValueChange = vi.fn();
    const { getByRole } = renderWithTheme(
      <GlassSwitch label="Locked" disabled defaultValue={false} onValueChange={onValueChange} />,
    );
    fireEvent.click(getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  test('decorative (no handler) does not throw on press', () => {
    const { getByRole } = renderWithTheme(<GlassSwitch label="Read-only" defaultValue={true} />);
    expect(() => fireEvent.click(getByRole('switch'))).not.toThrow();
  });

  test('two full toggles flip the state back to the original', () => {
    const onValueChange = vi.fn();
    const { getByRole } = renderWithTheme(
      <GlassSwitch label="Wi-Fi" defaultValue={false} onValueChange={onValueChange} />,
    );
    const startBg = getByRole('switch').style.backgroundColor;
    fireEvent.click(getByRole('switch'));
    fireEvent.click(getByRole('switch'));
    expect(onValueChange).toHaveBeenNthCalledWith(1, true);
    expect(onValueChange).toHaveBeenNthCalledWith(2, false);
    expect(getByRole('switch').style.backgroundColor).toBe(startBg);
  });
});
