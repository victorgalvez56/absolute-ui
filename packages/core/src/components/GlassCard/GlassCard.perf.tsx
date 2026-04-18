import { Text } from 'react-native';
import { measurePerformance } from 'reassure';
import { AbsoluteUIContext, defaultContextValue } from '../../theme-context.js';
import { GlassCard } from './GlassCard.js';

test('GlassCard idle render', async () => {
  await measurePerformance(
    <AbsoluteUIContext.Provider value={defaultContextValue}>
      <GlassCard>
        <GlassCard.Header title="Now Playing" subtitle="Liquid Glass" />
        <GlassCard.Body>
          <Text>Body copy</Text>
        </GlassCard.Body>
      </GlassCard>
    </AbsoluteUIContext.Provider>,
  );
});
