import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MedicationCard } from '../../components/MedicationCard';

export default function HomePage() {
  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <Text>Página: Home</Text>

      <MedicationCard
        medicationName='Lisinopril'
        medicationType='tablet'
        medicationUnit='10mg • 1 tablet'
        doseStatus='pending'
        scheduleAt={new Date().toISOString()}
      />

      <MedicationCard
        medicationName='Vitamin D3'
        medicationType='capsule'
        medicationUnit='2000 IU • 1 capsule'
        doseStatus='administered'
        scheduleAt={new Date(Date.now() - 3600000).toISOString()}
        confirmedAt={new Date(Date.now() - 3540000).toISOString()}
      />

      <MedicationCard
        medicationName='Amoxicillin'
        medicationType='liquid'
        medicationUnit='250mg • 5ml'
        doseStatus='skipped'
        scheduleAt={new Date(Date.now() - 7200000).toISOString()}
      />

      <MedicationCard
        medicationName='Metformin'
        medicationType='tablet'
        medicationUnit='500mg • 1 tablet'
        doseStatus='missed'
        scheduleAt={new Date(Date.now() - 10800000).toISOString()}
      />

      <MedicationCard
        medicationName='Unknown supplement'
        medicationType='other'
        medicationUnit='1 unit'
        doseStatus='pending'
        scheduleAt={new Date(Date.now() + 3600000).toISOString()}
      />
    </SafeAreaView>
  );
}
