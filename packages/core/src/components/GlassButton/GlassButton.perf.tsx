import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassButton } from './GlassButton.js';

test('GlassButton idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassButton accessibilityLabel="test" onPress={() => {}}>
        Tap
      </GlassButton>
    </AbsoluteUIContext.Provider>,
  );
});
