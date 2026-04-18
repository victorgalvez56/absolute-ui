import { Text } from 'react-native';
import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassModal } from './GlassModal.js';

test('GlassModal idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassModal visible={true} onDismiss={() => {}} title="Confirm" description="Are you sure?">
        <Text>Modal body</Text>
      </GlassModal>
    </AbsoluteUIContext.Provider>,
  );
});
