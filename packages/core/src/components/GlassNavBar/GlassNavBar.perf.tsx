import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassNavBar } from './GlassNavBar.js';

test('GlassNavBar idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassNavBar title="Now Playing" />
    </AbsoluteUIContext.Provider>,
  );
});
