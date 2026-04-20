import { SelectControl } from '@/app/_components/playground/controls';
import { glassStyleFor, noiseStyleFor } from '@/lib/glass-css';
import type { DemoConfig } from './types';

type Values = {
  activeKey: string;
};

const TABS = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'search', label: 'Search', icon: '⌕' },
  { key: 'feed', label: 'Feed', icon: '≡' },
  { key: 'profile', label: 'Profile', icon: '◐' },
];

const tabOptions = TABS.map((t) => ({ label: t.label, value: t.key }));

export const glassTabBarDemo: DemoConfig<Values> = {
  initialValues: { activeKey: 'home' },
  presets: TABS.map((t) => ({ label: t.label, values: { activeKey: t.key } })),
  renderControls: ({ values, setValue }) => (
    <>
      <SelectControl
        label="activeKey"
        value={values.activeKey}
        options={tabOptions}
        onChange={(v) => setValue('activeKey', v)}
        hint="Selected tab. A 2pt underline in theme.accent marks the state."
      />
    </>
  ),
  renderPreview: ({ values, theme }) => (
    <div
      style={{
        ...glassStyleFor(theme, 2, '2xl'),
        width: '100%',
        maxWidth: 440,
      }}
    >
      <div aria-hidden style={noiseStyleFor(theme, 2)} />
      <div className="relative flex items-stretch">
        {TABS.map((tab) => {
          const active = tab.key === values.activeKey;
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={active}
              className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2"
              style={{
                color: active ? theme.colors.textPrimary : theme.colors.textSecondary,
                borderBottom: `2px solid ${active ? theme.colors.accent : 'transparent'}`,
                fontWeight: active ? 700 : 500,
              }}
            >
              <span aria-hidden className="text-lg leading-none">
                {tab.icon}
              </span>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  ),
  generateCode: ({ values }) =>
    `const items = [
  { key: 'home',    label: 'Home',    leading: <HomeIcon /> },
  { key: 'search',  label: 'Search',  leading: <SearchIcon /> },
  { key: 'feed',    label: 'Feed',    leading: <FeedIcon /> },
  { key: 'profile', label: 'Profile', leading: <ProfileIcon /> },
];

<GlassTabBar
  items={items}
  activeKey="${values.activeKey}"
  onTabPress={setActive}
/>`,
};
