import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { MedicationCard } from '../../components/MedicationCard';
import { Header } from '../../components/Header';
import ActiveCard from '../../components/ActiveMedicationCard';
import MedicationTitle from './MedicationTitle';
import DailyMedicationTitle from './DailyMedicationsTitle';

const MOCK_ACTIVE = {
  medicationName: 'Lisinopril',
  medicationUnit: '10mg • 1 Comprimido',
  medicationType: 'tablet' as const,
  scheduledAt: new Date().toISOString(),
};

const MOCK_MEDICATIONS = [
  {
    id: '1',
    medicationName: 'Vitamina D3',
    medicationUnit: '2000 UI • 1 Cápsula',
    medicationType: 'capsule' as const,
    doseStatus: 'administered' as const,
    scheduleAt: new Date(Date.now() - 3600000).toISOString(),
    confirmedAt: new Date(Date.now() - 3540000).toISOString(),
  },
  {
    id: '2',
    medicationName: 'Atorvastatina',
    medicationUnit: '20mg • 1 Comprimido',
    medicationType: 'tablet' as const,
    doseStatus: 'pending' as const,
    scheduleAt: new Date(Date.now() + 7200000).toISOString(),
  },
  {
    id: '3',
    medicationName: 'Metformina',
    medicationUnit: '500mg • 1 Comprimido',
    medicationType: 'tablet' as const,
    doseStatus: 'skipped' as const,
    scheduleAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export default function HomePage() {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white }}
      edges={['top']}
    >
      <Header />

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <MedicationTitle />

        <ActiveCard
          medicationName={MOCK_ACTIVE.medicationName}
          medicationUnit={MOCK_ACTIVE.medicationUnit}
          medicationType={MOCK_ACTIVE.medicationType}
          scheduledAt={MOCK_ACTIVE.scheduledAt}
          onTake={() => {}}
          onSkip={() => {}}
        />

        <View style={{ gap: spacing.sm }}>
          <DailyMedicationTitle />

          {MOCK_MEDICATIONS.map((medication) => (
            <MedicationCard
              key={medication.id}
              medicationName={medication.medicationName}
              medicationUnit={medication.medicationUnit}
              medicationType={medication.medicationType}
              doseStatus={medication.doseStatus}
              scheduleAt={medication.scheduleAt}
              confirmedAt={medication.confirmedAt}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
