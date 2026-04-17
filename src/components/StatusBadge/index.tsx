import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { DoseStatus } from '../../types/doseStatusType';
import { Icon } from '../Common/Icon';

interface StatusBadgeProps {
  status: DoseStatus;
}

const statusIcons: Record<
  DoseStatus,
  React.ComponentProps<typeof Icon>['name']
> = {
  administered: 'checkmark-circle',
  missed: 'close-circle-outline',
  skipped: 'remove-circle-outline',
  pending: 'time-outline',
};

const statusLabels: Record<DoseStatus, string> = {
  administered: 'Tomado',
  missed: 'Perdeu',
  skipped: 'Pulado',
  pending: 'Pendente',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;
  const config = colors.status[status];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: config.background,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.full,
          gap: spacing.xs,
        },
      ]}
    >
      <Icon name={statusIcons[status]} size={12} color={config.icon} />
      <Text
        style={{
          fontSize: typography.sizes.caption,
          fontWeight: typography.weights.semibold,
          color: config.text,
        }}
      >
        {statusLabels[status]}
      </Text>
    </View>
  );
}
