import { defaultPreferences } from '@absolute-ui/a11y';
import { AbsoluteUIContext } from '@absolute-ui/core';
import type { Theme } from '@absolute-ui/tokens';
import type { ReactNode } from 'react';

/**
 * Shared mobile chrome for screen stories. 390x844 is the iPhone
 * 15 Pro logical viewport; 55 / 44 is the corner radius / Dynamic
 * Island inset that iOS itself paints, so the stories read as
 * "real screen" instead of "web div".
 */
export const PHONE_WIDTH = 390;
export const PHONE_HEIGHT = 844;

type Props = {
  theme: Theme;
  children: ReactNode;
  showStatusBar?: boolean;
};

export function PhoneFrame({ theme, children, showStatusBar = true }: Props) {
  return (
    <AbsoluteUIContext.Provider value={{ theme, preferences: defaultPreferences }}>
      <div
        style={{
          width: PHONE_WIDTH,
          height: PHONE_HEIGHT,
          borderRadius: 55,
          overflow: 'hidden',
          position: 'relative',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif',
          background: buildPhoneBackground(theme),
          boxShadow:
            '0 30px 60px -20px rgba(0,0,0,0.45), 0 12px 24px -10px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)',
          color: theme.colors.textPrimary,
        }}
      >
        {showStatusBar ? <StatusBar theme={theme} /> : null}
        <div
          style={{
            position: 'absolute',
            top: showStatusBar ? 56 : 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteUIContext.Provider>
  );
}

function StatusBar({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        padding: '18px 32px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: theme.colors.textPrimary,
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: 0.1,
        zIndex: 2,
      }}
    >
      <span>9:41</span>
      <div
        aria-hidden
        style={{
          width: 110,
          height: 34,
          borderRadius: 17,
          background: 'rgba(0,0,0,0.88)',
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      <span style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
        <span aria-hidden>•••</span>
        <span aria-hidden>􀙇</span>
        <span aria-hidden>100</span>
      </span>
    </div>
  );
}

function buildPhoneBackground(theme: Theme): string {
  switch (theme.name) {
    case 'aurora':
      return 'linear-gradient(160deg, #1b1436 0%, #0b0b20 40%, #0a1a28 100%), radial-gradient(1000px at 20% 0%, rgba(124,92,255,0.35) 0%, transparent 60%)';
    case 'obsidian':
      return 'radial-gradient(900px at 80% 20%, rgba(120,60,200,0.35) 0%, rgba(0,0,0,0) 55%), radial-gradient(700px at 20% 90%, rgba(255,60,160,0.25) 0%, rgba(0,0,0,0) 60%), #050508';
    case 'frost':
      return 'radial-gradient(900px at 30% 10%, rgba(180,220,255,0.9) 0%, rgba(255,255,255,0.6) 45%, rgba(232,240,252,1) 100%)';
    case 'sunset':
      return 'radial-gradient(900px at 20% 10%, rgba(255,175,90,0.95) 0%, rgba(255,220,160,0.85) 45%, rgba(255,200,170,0.9) 100%)';
    default:
      return theme.colors.background;
  }
}

export function PhoneStage({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 32,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 32,
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#15151b',
      }}
    >
      {children}
    </div>
  );
}
