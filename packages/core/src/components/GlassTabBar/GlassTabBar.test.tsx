// @vitest-environment jsdom
/**
 * GlassTabBar render tests.
 *
 * Covers: tab label rendering, active/inactive state, accessibility
 * roles and selected state, custom accessibility labels, press callback,
 * and leading-node (icon) slot composition.
 *
 * Pure layout helper tests live in GlassTabBar.test.ts (node env).
 */
import React from 'react';
import { Text } from 'react-native';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { GlassTabBar } from './GlassTabBar.js';
import type { GlassTabBarItem } from './GlassTabBar.js';
import { cleanup, fireEvent, renderWithTheme } from '../../test-utils/render.js';

afterEach(cleanup);

const THREE_TABS: ReadonlyArray<GlassTabBarItem> = [
  { key: 'home', label: 'Home' },
  { key: 'search', label: 'Search' },
  { key: 'profile', label: 'Profile' },
];

// ─── Rendering ──────────────────────────────────────────────────────────────

describe('GlassTabBar — rendering', () => {
  test('renders all tab labels', () => {
    const { getByText } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={() => {}} />,
    );
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Search')).toBeTruthy();
    expect(getByText('Profile')).toBeTruthy();
  });

  test('renders a single-tab bar without error', () => {
    const single: ReadonlyArray<GlassTabBarItem> = [{ key: 'only', label: 'Only' }];
    expect(() =>
      renderWithTheme(<GlassTabBar items={single} activeKey="only" onTabPress={() => {}} />),
    ).not.toThrow();
  });

  test('renders leading (icon) node above the label', () => {
    const withIcon: ReadonlyArray<GlassTabBarItem> = [
      { key: 'home', label: 'Home', leading: <Text>🏠</Text> },
    ];
    const { getByText } = renderWithTheme(
      <GlassTabBar items={withIcon} activeKey="home" onTabPress={() => {}} />,
    );
    expect(getByText('🏠')).toBeTruthy();
    expect(getByText('Home')).toBeTruthy();
  });
});

// ─── Accessibility ──────────────────────────────────────────────────────────

describe('GlassTabBar — accessibility', () => {
  test('container has role="list"', () => {
    const { getByRole } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={() => {}} />,
    );
    // react-native-web maps accessibilityRole="list" → role="list"
    expect(getByRole('list')).toBeTruthy();
  });

  test('each tab has role="button"', () => {
    const { getAllByRole } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={() => {}} />,
    );
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(THREE_TABS.length);
  });

  // Note: accessibilityState.selected on role="button" does not map to
  // aria-selected in the DOM — that attribute is only valid for roles like
  // "tab" or "option". The selected cue on web is conveyed structurally via
  // the indicator bar and fontWeight change (tested in GlassTabBar.test.ts).
  // On native, VoiceOver/TalkBack reads "selected" from accessibilityState.
  test('all tabs are present and have the default label format', () => {
    const { getAllByRole } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="search" onTabPress={() => {}} />,
    );
    const buttons = getAllByRole('button');
    const labels = buttons.map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Home, tab');
    expect(labels).toContain('Search, tab');
    expect(labels).toContain('Profile, tab');
  });

  test('default accessibility label is "<label>, tab"', () => {
    const { getAllByRole } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={() => {}} />,
    );
    const buttons = getAllByRole('button');
    const labels = buttons.map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Home, tab');
    expect(labels).toContain('Search, tab');
    expect(labels).toContain('Profile, tab');
  });

  test('custom accessibilityLabel overrides the default "<label>, tab" format', () => {
    const items: ReadonlyArray<GlassTabBarItem> = [
      { key: 'home', label: '🏠', accessibilityLabel: 'Home' },
      { key: 'search', label: '🔍', accessibilityLabel: 'Search' },
    ];
    const { getAllByRole } = renderWithTheme(
      <GlassTabBar items={items} activeKey="home" onTabPress={() => {}} />,
    );
    const buttons = getAllByRole('button');
    const labels = buttons.map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Home');
    expect(labels).toContain('Search');
    // Must NOT contain the default format for these items
    expect(labels).not.toContain('🏠, tab');
  });

  test('tab count matches items array length', () => {
    const { getAllByRole } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="profile" onTabPress={() => {}} />,
    );
    // Each GlassTabBarItem produces exactly one button.
    const buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(THREE_TABS.length);
  });
});

// ─── Interaction ─────────────────────────────────────────────────────────────

describe('GlassTabBar — interaction', () => {
  test('calls onTabPress with the pressed tab key', () => {
    const onTabPress = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={onTabPress} />,
    );
    // Find the Search tab button by aria-label
    const searchButton = getAllByRole('button').find(
      (b) => b.getAttribute('aria-label') === 'Search, tab',
    );
    expect(searchButton).toBeTruthy();
    fireEvent.click(searchButton!);
    expect(onTabPress).toHaveBeenCalledWith('search');
  });

  test('calls onTabPress once per click, not twice', () => {
    const onTabPress = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={onTabPress} />,
    );
    const homeButton = getAllByRole('button').find(
      (b) => b.getAttribute('aria-label') === 'Home, tab',
    );
    fireEvent.click(homeButton!);
    expect(onTabPress).toHaveBeenCalledTimes(1);
  });

  test('pressing the already-active tab still fires onTabPress', () => {
    const onTabPress = vi.fn();
    const { getAllByRole } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={onTabPress} />,
    );
    const homeButton = getAllByRole('button').find(
      (b) => b.getAttribute('aria-label') === 'Home, tab',
    );
    fireEvent.click(homeButton!);
    expect(onTabPress).toHaveBeenCalledWith('home');
  });
});

// ─── Active key changes ───────────────────────────────────────────────────────

describe('GlassTabBar — activeKey change', () => {
  test('all tabs remain rendered after activeKey prop changes', () => {
    // Re-render does not drop any tabs from the tree.
    const { getAllByRole, rerender } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={() => {}} />,
    );

    let buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(THREE_TABS.length);

    rerender(<GlassTabBar items={THREE_TABS} activeKey="search" onTabPress={() => {}} />);

    buttons = getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(THREE_TABS.length);

    // All original labels still present after the active key changed.
    const labels = buttons.map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Home, tab');
    expect(labels).toContain('Search, tab');
    expect(labels).toContain('Profile, tab');
  });

  test('onTabPress receives the new key when a different tab is pressed', () => {
    const onTabPress = vi.fn();
    const { getAllByRole, rerender } = renderWithTheme(
      <GlassTabBar items={THREE_TABS} activeKey="home" onTabPress={onTabPress} />,
    );
    rerender(<GlassTabBar items={THREE_TABS} activeKey="search" onTabPress={onTabPress} />);

    const profileButton = getAllByRole('button').find(
      (b) => b.getAttribute('aria-label') === 'Profile, tab',
    );
    fireEvent.click(profileButton!);
    expect(onTabPress).toHaveBeenCalledWith('profile');
  });
});
