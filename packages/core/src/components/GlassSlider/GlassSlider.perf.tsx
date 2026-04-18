import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassSlider } from './GlassSlider.js';

test('GlassSlider idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassSlider
        label="Volume"
        value={42}
        minimumValue={0}
        maximumValue={100}
        onValueChange={() => {}}
      />
    </AbsoluteUIContext.Provider>,
  );
});
