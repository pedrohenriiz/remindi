import { Text, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';

interface DoseListHeaderProps {
  date: string;
  administeredDoses: number;
  totalDoses: number;
}

export default function DoseListHeader({
  date,
  administeredDoses,
  totalDoses,
}: DoseListHeaderProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        style={{
          fontSize: typography.sizes.body,
          fontWeight: typography.weights.semibold,
          color: colors.primary[800],
        }}
      >
        {date}
      </Text>
      <Text
        style={{
          fontSize: typography.sizes.label,
          color: colors.neutral[500],
        }}
      >
        {administeredDoses} de {totalDoses} doses administradas
      </Text>
    </View>
  );
}
