import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassToast } from './GlassToast.js';

test('GlassToast idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassToast visible={true} message="Saved" />
    </AbsoluteUIContext.Provider>,
  );
});
