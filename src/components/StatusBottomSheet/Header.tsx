import { Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { DoseStatus } from '../../types/doseStatusType';
import { StatusBadge } from '../StatusBadge';

interface HeaderProps {
  medicationName: string;
  medicationUnit: string;
  scheduledTime: string;
  currentStatus: DoseStatus;
}

export function Header({
  medicationName,
  medicationUnit,
  scheduledTime,
  currentStatus,
}: HeaderProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View
      style={{
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border.default,
        gap: spacing.xs,
      }}
    >
      <Text
        style={{
          fontSize: typography.sizes.caption,
          color: colors.text.tertiary,
        }}
      >
        Alterar status
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: typography.sizes.title,
            fontWeight: typography.weights.semibold,
            color: colors.text.primary,
          }}
        >
          {medicationName}
        </Text>
        <StatusBadge status={currentStatus} />
      </View>

      <Text
        style={{
          fontSize: typography.sizes.caption,
          color: colors.text.tertiary,
        }}
      >
        {medicationUnit} • {scheduledTime}
      </Text>
    </View>
  );
}
