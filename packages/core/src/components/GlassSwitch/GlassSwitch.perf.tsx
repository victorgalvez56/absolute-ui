import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassSwitch } from './GlassSwitch.js';

test('GlassSwitch idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassSwitch label="Notifications" value={true} onValueChange={() => {}} />
    </AbsoluteUIContext.Provider>,
  );
});
