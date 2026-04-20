import { Text, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

export default function MedicationTitle() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        style={{
          fontSize: typography.sizes.caption,
          fontWeight: typography.weights.semibold,
          color: colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        {today}
      </Text>
      <Text
        style={{
          fontSize: typography.sizes.headline,
          fontWeight: typography.weights.bold,
          color: colors.text.primary,
        }}
      >
        Medicamentos
      </Text>
    </View>
  );
}
