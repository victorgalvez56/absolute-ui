// @vitest-environment jsdom
/**
 * GlassNavBar render tests.
 *
 * Exercises the JSX layer: content rendering, accessibility roles and
 * labels, slot composition, and the mount animation smoke-test
 * (animation is instant in the Reanimated stub — we verify the
 * component reaches its final visible state, not the spring path).
 *
 * Pure layout helper tests live in GlassNavBar.test.ts (node env).
 */
import React from 'react';
import { Text } from 'react-native';
import { afterEach, describe, expect, test } from 'vitest';
import { GlassNavBar } from './GlassNavBar.js';
import { cleanup, renderWithTheme } from '../../test-utils/render.js';

afterEach(cleanup);

// ─── Rendering ──────────────────────────────────────────────────────────────

describe('GlassNavBar — rendering', () => {
  test('renders the title text', () => {
    const { getByText } = renderWithTheme(<GlassNavBar title="Settings" />);
    expect(getByText('Settings')).toBeTruthy();
  });

  test('renders with no leading or trailing (minimal props)', () => {
    expect(() => renderWithTheme(<GlassNavBar title="Home" />)).not.toThrow();
  });

  test('renders leading slot content', () => {
    const { getByText } = renderWithTheme(
      <GlassNavBar title="Messages" leading={<Text>Back</Text>} />,
    );
    expect(getByText('Back')).toBeTruthy();
  });

  test('renders trailing slot content', () => {
    const { getByText } = renderWithTheme(
      <GlassNavBar title="Messages" trailing={<Text>Edit</Text>} />,
    );
    expect(getByText('Edit')).toBeTruthy();
  });

  test('renders leading and trailing simultaneously without collision', () => {
    const { getByText } = renderWithTheme(
      <GlassNavBar
        title="Dashboard"
        leading={<Text>←</Text>}
        trailing={<Text>⚙</Text>}
      />,
    );
    expect(getByText('←')).toBeTruthy();
    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText('⚙')).toBeTruthy();
  });
});

// ─── Accessibility ──────────────────────────────────────────────────────────

describe('GlassNavBar — accessibility', () => {
  test('title element has role="heading"', () => {
    const { getByRole } = renderWithTheme(<GlassNavBar title="Profile" />);
    // react-native-web maps accessibilityRole="header" → role="heading"
    expect(getByRole('heading')).toBeTruthy();
  });

  test('heading text matches the title prop', () => {
    const { getByRole } = renderWithTheme(<GlassNavBar title="Notifications" />);
    expect(getByRole('heading').textContent).toBe('Notifications');
  });

  test('title is the only heading in the component', () => {
    const { getAllByRole } = renderWithTheme(
      <GlassNavBar title="Profile" leading={<Text>Back</Text>} trailing={<Text>Done</Text>} />,
    );
    expect(getAllByRole('heading')).toHaveLength(1);
  });

  test('slot nodes are not headings', () => {
    // leading/trailing are presentational — must not add spurious headings
    const { queryAllByRole } = renderWithTheme(
      <GlassNavBar
        title="Timeline"
        leading={<Text accessibilityRole="button">←</Text>}
        trailing={<Text accessibilityRole="button">+</Text>}
      />,
    );
    // Only the title should be a heading
    expect(queryAllByRole('heading')).toHaveLength(1);
  });
});

// ─── Motion (smoke-test through Reanimated stub) ─────────────────────────────

describe('GlassNavBar — mount animation smoke-test', () => {
  test('component is visible on first render (animation is instant in tests)', () => {
    // The Reanimated stub makes withSpring/withTiming instant. After mount
    // the opacity shared value is 1 and the component is in the tree.
    const { getByText } = renderWithTheme(<GlassNavBar title="Ready" />);
    expect(getByText('Ready')).toBeTruthy();
  });
});
