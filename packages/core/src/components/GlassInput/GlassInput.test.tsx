// @vitest-environment jsdom
/**
 * GlassInput render tests.
 *
 * Covers: label / helper / error text rendering, controlled vs
 * uncontrolled value flow, focus/blur handler plumbing, accessibility
 * label priority, aria-invalid wiring, and disabled/read-only gating.
 *
 * Pure style/a11y helper tests live in GlassInput.test.ts (node env).
 */
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { GlassInput } from './GlassInput.js';
import { cleanup, fireEvent, renderWithTheme } from '../../test-utils/render.js';

afterEach(cleanup);

describe('GlassInput — rendering', () => {
  test('renders the visible label', () => {
    const { getByText } = renderWithTheme(<GlassInput label="Email" placeholder="you@acme.co" />);
    expect(getByText('Email')).toBeTruthy();
  });

  test('renders helper text below the field', () => {
    const { getByText } = renderWithTheme(
      <GlassInput label="Email" helperText="We only use it to send receipts." />,
    );
    expect(getByText('We only use it to send receipts.')).toBeTruthy();
  });

  test('invalid + errorText renders the error text in place of helper', () => {
    const { getByText, queryByText } = renderWithTheme(
      <GlassInput
        label="Email"
        helperText="We only use it to send receipts."
        errorText="Enter a valid address."
        invalid
      />,
    );
    expect(getByText('Enter a valid address.')).toBeTruthy();
    expect(queryByText('We only use it to send receipts.')).toBeNull();
  });

  test('invalid without errorText still renders the helper', () => {
    const { getByText } = renderWithTheme(
      <GlassInput label="Email" helperText="Required" invalid />,
    );
    expect(getByText('Required')).toBeTruthy();
  });

  test('placeholder is applied to the TextInput', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <GlassInput label="Email" placeholder="you@acme.co" />,
    );
    expect(getByPlaceholderText('you@acme.co')).toBeTruthy();
  });
});

describe('GlassInput — accessibility', () => {
  test('accessibility label defaults to the visible label', () => {
    const { getByLabelText } = renderWithTheme(<GlassInput label="Email address" />);
    expect(getByLabelText('Email address')).toBeTruthy();
  });

  test('accessibilityLabel prop overrides the visible label', () => {
    const { getByLabelText } = renderWithTheme(
      <GlassInput label="📧" accessibilityLabel="Email address" />,
    );
    expect(getByLabelText('Email address')).toBeTruthy();
  });

  test('falls back to placeholder when neither label nor override is set', () => {
    const { getByLabelText } = renderWithTheme(<GlassInput placeholder="Search…" />);
    expect(getByLabelText('Search…')).toBeTruthy();
  });

  test('invalid=true sets aria-invalid="true" on the TextInput', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <GlassInput placeholder="Email" invalid errorText="Required" />,
    );
    expect(getByPlaceholderText('Email').getAttribute('aria-invalid')).toBe('true');
  });

  test('disabled is reflected via the readonly DOM attribute', () => {
    // RN-web maps TextInput editable=false → <input readonly>. It does
    // not emit aria-disabled on <input>; the readonly contract is the
    // DOM truth for "not editable". `disabled` (our prop) flows through
    // isGlassInputInteractive → editable=false on the RN TextInput.
    const { getByPlaceholderText } = renderWithTheme(
      <GlassInput placeholder="Email" disabled />,
    );
    expect(getByPlaceholderText('Email').hasAttribute('readonly')).toBe(true);
  });

  test('editable=false also flips the readonly attribute', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <GlassInput placeholder="Email" editable={false} />,
    );
    expect(getByPlaceholderText('Email').hasAttribute('readonly')).toBe(true);
  });

  test('invalid field still renders the visible error text', () => {
    // The accessibility hint is composed in style.ts (see the node-only
    // suite for coverage); RN-web does not project `accessibilityHint`
    // to a stable DOM attribute on <input>, so asserting on the DOM
    // would be brittle. Instead we verify the user-visible affordance:
    // the error string is rendered below the field.
    const { getByText } = renderWithTheme(
      <GlassInput
        placeholder="Email"
        helperText="We only use it to send receipts."
        errorText="Enter a valid address."
        invalid
      />,
    );
    expect(getByText('Enter a valid address.')).toBeTruthy();
  });
});

describe('GlassInput — interaction', () => {
  test('controlled: typing fires onChangeText with the new text', () => {
    const onChangeText = vi.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <GlassInput placeholder="Email" value="" onChangeText={onChangeText} />,
    );
    fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'a@b.co' } });
    expect(onChangeText).toHaveBeenCalledWith('a@b.co');
  });

  test('uncontrolled: typing updates the input value via defaultValue', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <GlassInput placeholder="Email" defaultValue="seed" />,
    );
    const el = getByPlaceholderText('Email') as HTMLInputElement;
    expect(el.value).toBe('seed');
    fireEvent.change(el, { target: { value: 'updated' } });
    expect(el.value).toBe('updated');
  });

  test('focus calls onFocus, blur calls onBlur', () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <GlassInput placeholder="Email" onFocus={onFocus} onBlur={onBlur} />,
    );
    const el = getByPlaceholderText('Email');
    fireEvent.focus(el);
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent.blur(el);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  test('disabled gates the input via readonly', () => {
    const onChangeText = vi.fn();
    const { getByPlaceholderText } = renderWithTheme(
      <GlassInput placeholder="Email" disabled value="" onChangeText={onChangeText} />,
    );
    const el = getByPlaceholderText('Email') as HTMLInputElement;
    // RN-web's TextInput relies on HTML `readonly` (not `disabled`) to
    // gate editing. A real user can't type into a readonly input; we
    // verify the attribute is set so the browser enforces the contract.
    expect(el.hasAttribute('readonly')).toBe(true);
  });
});
