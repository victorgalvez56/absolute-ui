import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassTabBar } from './GlassTabBar.js';

const items = [
  { key: 'home', label: 'Home' },
  { key: 'search', label: 'Search' },
  { key: 'library', label: 'Library' },
] as const;

test('GlassTabBar idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassTabBar items={items} activeKey="home" onTabPress={() => {}} />
    </AbsoluteUIContext.Provider>,
  );
});
