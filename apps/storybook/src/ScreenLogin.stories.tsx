import {
  GlassButton,
  GlassCard,
  GlassInput,
  GlassNavBar,
  GlassSurface,
} from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { PhoneFrame, PhoneStage } from './screens/phone-frame.js';

const meta: Meta = {
  title: 'Screens/Login',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Email + password entry. Exercises GlassInput invalid state, APCA-safe helper text, and a footer-only CTA group.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function LoginScreen({ theme }: { theme: Theme }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emailInvalid = submitted && !isValidEmail(email);
  const passwordInvalid = submitted && password.length < 8;

  return (
    <PhoneFrame theme={theme}>
      <GlassNavBar
        title="Sign in"
        leading={<NavGlyph label="Back" glyph="‹" />}
        trailing={<NavGlyph label="Help" glyph="?" />}
      />
      <div
        style={{
          flex: 1,
          padding: '32px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: theme.colors.textPrimary }}>
            Welcome back
          </div>
          <div style={{ marginTop: 6, fontSize: 14, color: theme.colors.textSecondary }}>
            Sign in to pick up where you left off.
          </div>
        </div>

        <GlassCard elevation={2}>
          <GlassCard.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <GlassInput
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                invalid={emailInvalid}
                {...(emailInvalid ? { errorText: 'Please enter a valid email address.' } : {})}
              />
              <GlassInput
                label="Password"
                placeholder="At least 8 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                invalid={passwordInvalid}
                {...(passwordInvalid
                  ? { errorText: 'Password must be 8+ characters.' }
                  : { helperText: 'Use a unique, memorable passphrase.' })}
              />
            </div>
          </GlassCard.Body>
          <GlassCard.Divider />
          <GlassCard.Footer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <GlassButton accessibilityLabel="Sign in" onPress={() => setSubmitted(true)}>
                Sign in
              </GlassButton>
              <GlassButton
                accessibilityLabel="Forgot your password"
                radius="md"
                elevation={0}
                onPress={() => {}}
              >
                Forgot password?
              </GlassButton>
            </div>
          </GlassCard.Footer>
        </GlassCard>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            color: theme.colors.textSecondary,
          }}
        >
          New here?
          <span style={{ color: theme.colors.accent, fontWeight: 600 }}>Create an account</span>
        </div>
      </div>
    </PhoneFrame>
  );
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function NavGlyph({ label, glyph }: { label: string; glyph: string }) {
  return (
    <GlassSurface
      elevation={0}
      radius="pill"
      accessibilityLabel={label}
      style={{
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontSize: 18, fontWeight: 600 }}>{glyph}</span>
    </GlassSurface>
  );
}

export const Aurora: Story = {
  render: () => (
    <PhoneStage>
      <LoginScreen theme={themes.aurora} />
    </PhoneStage>
  ),
};

export const Obsidian: Story = {
  render: () => (
    <PhoneStage>
      <LoginScreen theme={themes.obsidian} />
    </PhoneStage>
  ),
};

export const Frost: Story = {
  render: () => (
    <PhoneStage>
      <LoginScreen theme={themes.frost} />
    </PhoneStage>
  ),
};

export const Sunset: Story = {
  render: () => (
    <PhoneStage>
      <LoginScreen theme={themes.sunset} />
    </PhoneStage>
  ),
};

export const AllPersonalities: Story = {
  render: () => (
    <PhoneStage>
      {Object.values(themes).map((theme) => (
        <LoginScreen key={theme.name} theme={theme} />
      ))}
    </PhoneStage>
  ),
};
