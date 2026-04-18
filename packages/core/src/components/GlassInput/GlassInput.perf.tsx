import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassInput } from './GlassInput.js';

test('GlassInput idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassInput label="Email" placeholder="you@example.com" />
    </AbsoluteUIContext.Provider>,
  );
});
