// @vitest-environment jsdom
/**
 * GlassModal render tests.
 *
 * Covers: conditional mount (visible=false → null), content rendering,
 * title/description/children composition, accessibility roles and labels,
 * backdrop dismiss callback, and visibility transitions.
 *
 * The Reanimated stub makes animations instant and synchronous, so
 * useEnterExit's rendered state transitions inside act() deterministically.
 *
 * Pure layout helper tests live in GlassModal.test.ts (node env).
 */
import React from 'react';
import { Text } from 'react-native';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { GlassModal } from './GlassModal.js';
import { cleanup, fireEvent, renderWithTheme } from '../../test-utils/render.js';

afterEach(cleanup);

// ─── Conditional mount ────────────────────────────────────────────────────────

describe('GlassModal — conditional mount', () => {
  test('renders nothing when visible=false', () => {
    const { queryByRole } = renderWithTheme(
      <GlassModal visible={false} onDismiss={() => {}} title="Delete?" />,
    );
    // No heading in the tree when not visible
    expect(queryByRole('heading')).toBeNull();
  });

  test('renders content when visible=true', () => {
    const { getByRole } = renderWithTheme(
      <GlassModal visible={true} onDismiss={() => {}} title="Confirm" />,
    );
    expect(getByRole('heading')).toBeTruthy();
  });

  test('unmounts after visible transitions from true to false', () => {
    const { queryByText, rerender } = renderWithTheme(
      <GlassModal visible={true} onDismiss={() => {}} title="Are you sure?" />,
    );
    expect(queryByText('Are you sure?')).toBeTruthy();

    // Reanimated stub fires exit callback synchronously inside act(),
    // so rendered flips false immediately on the next render.
    rerender(<GlassModal visible={false} onDismiss={() => {}} title="Are you sure?" />);
    expect(queryByText('Are you sure?')).toBeNull();
  });

  test('remounts after visible cycles false → true → false', () => {
    const { queryByText, rerender } = renderWithTheme(
      <GlassModal visible={false} onDismiss={() => {}} title="Cycle" />,
    );
    expect(queryByText('Cycle')).toBeNull();

    rerender(<GlassModal visible={true} onDismiss={() => {}} title="Cycle" />);
    expect(queryByText('Cycle')).toBeTruthy();

    rerender(<GlassModal visible={false} onDismiss={() => {}} title="Cycle" />);
    expect(queryByText('Cycle')).toBeNull();
  });
});

// ─── Content rendering ────────────────────────────────────────────────────────

describe('GlassModal — content rendering', () => {
  test('renders title text', () => {
    const { getByText } = renderWithTheme(
      <GlassModal visible={true} onDismiss={() => {}} title="Delete this item?" />,
    );
    expect(getByText('Delete this item?')).toBeTruthy();
  });

  test('renders description text', () => {
    const { getByText } = renderWithTheme(
      <GlassModal
        visible={true}
        onDismiss={() => {}}
        description="This action cannot be undone."
      />,
    );
    expect(getByText('This action cannot be undone.')).toBeTruthy();
  });

  test('renders both title and description together', () => {
    const { getByText } = renderWithTheme(
      <GlassModal
        visible={true}
        onDismiss={() => {}}
        title="Confirm deletion"
        description="All your files will be removed."
      />,
    );
    expect(getByText('Confirm deletion')).toBeTruthy();
    expect(getByText('All your files will be removed.')).toBeTruthy();
  });

  test('renders children slot content', () => {
    const { getByText } = renderWithTheme(
      <GlassModal visible={true} onDismiss={() => {}}>
        <Text>Custom content here</Text>
      </GlassModal>,
    );
    expect(getByText('Custom content here')).toBeTruthy();
  });

  test('renders with no title, no description, and no children', () => {
    // Empty modal body is valid — accessibilityLabel covers the use-case
    expect(() =>
      renderWithTheme(
        <GlassModal
          visible={true}
          onDismiss={() => {}}
          accessibilityLabel="Loading"
        />,
      ),
    ).not.toThrow();
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe('GlassModal — accessibility', () => {
  test('title element has role="heading"', () => {
    const { getByRole } = renderWithTheme(
      <GlassModal visible={true} onDismiss={() => {}} title="Important" />,
    );
    // react-native-web maps accessibilityRole="header" → role="heading"
    expect(getByRole('heading')).toBeTruthy();
  });

  test('heading text matches the title prop', () => {
    const { getByRole } = renderWithTheme(
      <GlassModal visible={true} onDismiss={() => {}} title="My Title" />,
    );
    expect(getByRole('heading').textContent).toBe('My Title');
  });

  test('backdrop dismiss button has role="button" and correct label', () => {
    const { getByRole } = renderWithTheme(
      <GlassModal visible={true} onDismiss={() => {}} title="Close me" />,
    );
    const dismissBtn = getByRole('button', { name: 'Dismiss dialog' });
    expect(dismissBtn).toBeTruthy();
  });

  test('content area uses accessibilityLabel when no title or description', () => {
    const { getByLabelText } = renderWithTheme(
      <GlassModal
        visible={true}
        onDismiss={() => {}}
        accessibilityLabel="Loading spinner"
      />,
    );
    // The content AnimatedView gets aria-label when title/description absent
    expect(getByLabelText('Loading spinner')).toBeTruthy();
  });

  test('accessibilityLabel is NOT applied when title is present', () => {
    const { queryByLabelText } = renderWithTheme(
      <GlassModal
        visible={true}
        onDismiss={() => {}}
        title="Has a title"
        accessibilityLabel="Should be ignored"
      />,
    );
    // When title is present the title itself is the accessible name —
    // the explicit label should not be applied.
    expect(queryByLabelText('Should be ignored')).toBeNull();
  });
});

// ─── Interaction ──────────────────────────────────────────────────────────────

describe('GlassModal — interaction', () => {
  test('calls onDismiss when the backdrop button is clicked', () => {
    const onDismiss = vi.fn();
    const { getByRole } = renderWithTheme(
      <GlassModal visible={true} onDismiss={onDismiss} title="Confirm" />,
    );
    fireEvent.click(getByRole('button', { name: 'Dismiss dialog' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  test('onDismiss is not called before user interaction', () => {
    const onDismiss = vi.fn();
    renderWithTheme(<GlassModal visible={true} onDismiss={onDismiss} title="Waiting" />);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
