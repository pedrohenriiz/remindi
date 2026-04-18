import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon, IconName } from '../Common/Icon';
import { StatusBadge } from '../StatusBadge';
import { MedicationType } from '../../types/medicationType';
import { DoseStatus } from '../../types/doseStatusType';

interface MedicationCardProps {
  medicationType: MedicationType;
  medicationName: string;
  medicationUnit: string;
  doseStatus: DoseStatus;
  confirmedAt?: string;
  scheduleAt: string;
  onPress?: () => void;
}

const medicationTypeIcon: Record<MedicationType, IconName> = {
  tablet: 'Pill',
  capsule: 'PillBottle',
  liquid: 'Droplet',
  other: 'AlertCircle',
};

export function MedicationCard({
  medicationType,
  doseStatus,
  confirmedAt,
  scheduleAt,
  medicationName,
  medicationUnit,
  onPress,
}: MedicationCardProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  const statusBackground: Record<DoseStatus, string> = {
    pending: colors.primary[50],
    administered: colors.success[50],
    skipped: colors.error[50],
    missed: colors.error[50],
  };

  const statusIconBackground: Record<DoseStatus, [string, string]> = {
    pending: [colors.primary[100], colors.primary[500]],
    administered: [colors.success[100], colors.success[500]],
    skipped: [colors.error[100], colors.error[500]],
    missed: [colors.error[100], colors.error[500]],
  };

  const statusTextColor: Record<DoseStatus, string> = {
    pending: colors.primary[800],
    administered: colors.success[600],
    skipped: colors.error[600],
    missed: colors.error[600],
  };

  const [iconBg, iconColor] = statusIconBackground[doseStatus];

  const confirmedTime = confirmedAt
    ? new Date(confirmedAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const scheduledTime = new Date(scheduleAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: statusBackground[doseStatus],
        borderRadius: borderRadius.xl,
        padding: 20,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: borderRadius.full,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon
          name={medicationTypeIcon[medicationType]}
          size={20}
          color={iconColor}
        />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontSize: typography.sizes.label,
            fontWeight: typography.weights.semibold,
            color: statusTextColor[doseStatus],
          }}
        >
          {medicationName}
        </Text>

        <Text
          style={{
            fontSize: typography.sizes.caption,
            color: colors.text.tertiary,
          }}
        >
          {medicationUnit} • {scheduledTime}
        </Text>
      </View>

      <View
        style={{
          alignItems: 'flex-end',
          gap: spacing.xs,
        }}
      >
        <StatusBadge
          status={doseStatus}
          containerStyle={{ alignSelf: 'flex-end' }}
        />

        {confirmedTime && (
          <Text
            style={{
              fontSize: typography.sizes.caption,
              color: colors.text.tertiary,
            }}
          >
            Marcado às {confirmedTime}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
