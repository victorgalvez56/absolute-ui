import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext, GlassInput } from '@absolute-ui/core';
import { type Theme, themes } from '@absolute-ui/tokens';
import { useState } from 'react';

export default {
  title: 'Primitives / GlassInput',
};

function Backdrop({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: 'relative',
        padding: 32,
        borderRadius: 20,
        minHeight: 360,
        background: theme.dark
          ? 'radial-gradient(1200px at 20% 10%, #7a5cff 0%, #0f1020 60%)'
          : 'radial-gradient(1200px at 20% 10%, #ffc36b 0%, #f6eede 60%)',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}

function Swatch({ theme }: { theme: Theme }) {
  const [email, setEmail] = useState('');
  return (
    <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
      <Backdrop theme={theme}>
        <div
          style={{
            color: theme.colors.textPrimary,
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          {theme.label}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
          <GlassInput
            label="Email"
            placeholder="you@example.com"
            helperText="We never share your email."
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <GlassInput
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
          />
          <GlassInput label="Disabled field" defaultValue="Read-only value" disabled />
        </div>
      </Backdrop>
    </AbsoluteUIContext.Provider>
  );
}

export const AllPersonalities = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(320px, 1fr))',
      gap: 24,
      padding: 24,
    }}
  >
    {Object.values(themes).map((theme) => (
      <Swatch key={theme.name} theme={theme} />
    ))}
  </div>
);

export const States = () => (
  <AbsoluteUIContext.Provider value={{ theme: themes.aurora, preferences: defaultPreferences }}>
    <Backdrop theme={themes.aurora}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420 }}>
        <GlassInput label="Idle" placeholder="Tap to focus" />
        <GlassInput
          label="With helper text"
          placeholder="you@example.com"
          helperText="We never share your email."
        />
        <GlassInput
          label="Invalid"
          placeholder="you@example.com"
          defaultValue="not-an-email"
          invalid
          errorText="Please enter a valid email address."
        />
        <GlassInput
          label="Invalid with helper"
          placeholder="username"
          defaultValue=""
          invalid
          errorText="Username is required."
          helperText="3-20 characters, letters and numbers only."
        />
        <GlassInput label="Disabled" defaultValue="Read-only" disabled />
      </div>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);

export const ReducedTransparency = () => (
  <AbsoluteUIContext.Provider
    value={{
      theme: themes.obsidian,
      preferences: { ...defaultPreferences, reducedTransparency: true },
    }}
  >
    <Backdrop theme={themes.obsidian}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
        <div style={{ color: themes.obsidian.colors.textSecondary, fontSize: 12 }}>
          Reduced Transparency: glass recipe falls back to a solid surface via resolveGlassRecipe.
          Focus and error rings remain visible.
        </div>
        <GlassInput label="Email" placeholder="you@example.com" />
        <GlassInput
          label="With error"
          defaultValue="bad"
          invalid
          errorText="Please enter a valid email."
        />
      </div>
    </Backdrop>
  </AbsoluteUIContext.Provider>
);
