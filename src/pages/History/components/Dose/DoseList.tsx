import { View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import DoseListHeader from './DoseListHeader';
import { MedicationCard } from '../../../../components/MedicationCard';
import { Dose } from '../../../../database/repositories/doseRepository';
import HistoryMedicationCard from '../MedicationCard';

interface DoseListProps {
  date: string;
  administeredDoses: number;
  doses: Dose[];
}

export default function DoseList({
  date,
  administeredDoses,
  doses,
}: DoseListProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  const totalDoses = doses.length;

  return (
    <View style={{ gap: spacing.md }}>
      <DoseListHeader
        date={date}
        administeredDoses={administeredDoses}
        totalDoses={totalDoses}
      />

      <View style={{ gap: spacing.sm }}>
        {doses.map((dose) => (
          <HistoryMedicationCard
            key={dose.id}
            medicationName={dose.medicationName}
            medicationUnit={dose.medicationUnit}
            medicationType={dose.medicationType as any}
            doseStatus={dose.status}
            scheduleAt={`${dose.scheduledDate}T${dose.scheduledTime}:00`}
            confirmedAt={dose.confirmedAt}
          />
        ))}
      </View>
    </View>
  );
}
