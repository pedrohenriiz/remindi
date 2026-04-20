import { Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

export default function DailyMedicationTitle() {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  return (
    <Text
      style={{
        fontSize: typography.sizes.body,
        fontWeight: typography.weights.semibold,
        color: colors.primary[800],
      }}
    >
      Medicamentos do dia
    </Text>
  );
}
