import { Text } from 'react-native';
import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassSheet } from './GlassSheet.js';

test('GlassSheet idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassSheet visible={true} onDismiss={() => {}} title="Settings">
        <Text>Sheet body</Text>
      </GlassSheet>
    </AbsoluteUIContext.Provider>,
  );
});
