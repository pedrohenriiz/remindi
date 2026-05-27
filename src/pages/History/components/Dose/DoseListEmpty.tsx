import { Text, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';

export default function DoseListEmpty() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View
      style={{
        padding: spacing.xl,
        alignItems: 'center',
        gap: spacing.sm,
      }}
    >
      <Text
        style={{
          fontSize: typography.sizes.body,
          fontWeight: typography.weights.medium,
          color: colors.text.secondary,
          textAlign: 'center',
        }}
      >
        Nenhuma dose registrada
      </Text>
      <Text
        style={{
          fontSize: typography.sizes.label,
          color: colors.text.tertiary,
          textAlign: 'center',
        }}
      >
        Selecione outro dia no calendário
      </Text>
    </View>
  );
}
