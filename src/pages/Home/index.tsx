import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimeSlotRow } from '../../components/TimeSlotRow';

export default function HomePage() {
  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <Text>Página: Home</Text>
    </SafeAreaView>
  );
}
