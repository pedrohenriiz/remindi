import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { DoseStatus } from '../../types/doseStatusType';
import { Icon } from '../Common/Icon';

interface StatusBadgeProps {
  status: DoseStatus;
  containerStyle?: StyleProp<ViewStyle>;
}

const statusIcons: Record<
  DoseStatus,
  React.ComponentProps<typeof Icon>['name']
> = {
  administered: 'AlertCircle',
  missed: 'AlertCircle',
  skipped: 'AlertCircle',
  pending: 'AlertCircle',
};

const statusLabels: Record<DoseStatus, string> = {
  administered: 'Tomado',
  missed: 'Perdeu',
  skipped: 'Pulado',
  pending: 'Pendente',
};

export function StatusBadge({ status, containerStyle }: StatusBadgeProps) {
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
        containerStyle,
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
