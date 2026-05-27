import { ActivityIndicator } from 'react-native';
import { Dose } from '../../../../database/repositories/doseRepository';
import { useTheme } from '../../../../theme/ThemeProvider';
import DoseListEmpty from './DoseListEmpty';
import DoseList from './DoseList';

interface DoseSectionProps {
  isLoading: boolean;
  doses: Dose[];
  date: string;
  administeredDoses: number;
}

export function DoseSection({
  isLoading,
  doses,
  date,
  administeredDoses,
}: DoseSectionProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  if (isLoading) return <ActivityIndicator color={colors.primary[500]} />;
  if (doses.length === 0) return <DoseListEmpty />;
  return (
    <DoseList doses={doses} date={date} administeredDoses={administeredDoses} />
  );
}
