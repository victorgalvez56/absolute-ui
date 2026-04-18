import { Text } from 'react-native';
import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassSurface } from './GlassSurface.js';

test('GlassSurface idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassSurface elevation={1} radius="md">
        <Text>Surface</Text>
      </GlassSurface>
    </AbsoluteUIContext.Provider>,
  );
});
