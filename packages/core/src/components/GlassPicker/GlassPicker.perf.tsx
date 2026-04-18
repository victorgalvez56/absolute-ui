import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassPicker } from './GlassPicker.js';

const items = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Auto', value: 'auto' },
] as const;

test('GlassPicker idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassPicker label="Theme" items={items} value="light" onValueChange={() => {}} />
    </AbsoluteUIContext.Provider>,
  );
});
