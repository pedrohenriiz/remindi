import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon, IconName } from '../Common/Icon';
import { Button } from '../Common/Button';
import { MedicationType } from '../../types/medicationType';

interface ActiveCardProps {
  medicationName: string;
  medicationUnit: string;
  medicationType: MedicationType;
  scheduledAt: string;
  onTake?: () => void;
  onSkip?: () => void;
  onPress?: () => void;
}

const medicationTypeIcon: Record<MedicationType, IconName> = {
  tablet: 'Pill',
  capsule: 'PillBottle',
  liquid: 'Droplet',
  other: 'AlertCircle',
};

export default function ActiveCard({
  medicationName,
  medicationUnit,
  medicationType,
  scheduledAt,
  onTake,
  onSkip,
  onPress,
}: ActiveCardProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  const scheduledTime = new Date(scheduledAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={{
        backgroundColor: colors.primary[50],
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        gap: spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ gap: spacing.sm, flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
              backgroundColor: colors.primary[200],
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.sm,
              borderRadius: borderRadius.full,
              alignSelf: 'flex-start',
            }}
          >
            <Icon name='Clock' size={12} color={colors.primary[600]} />
            <Text
              style={{
                fontSize: typography.sizes.caption,
                fontWeight: typography.weights.semibold,
                color: colors.primary[700],
                textTransform: 'uppercase',
                letterSpacing: 0.4,
              }}
            >
              Próximo: {scheduledTime}
            </Text>
          </View>

          <View style={{ gap: 2 }}>
            <Text
              style={{
                fontSize: typography.sizes.headline,
                fontWeight: typography.weights.bold,
                color: colors.primary[700],
              }}
            >
              {medicationName}
            </Text>
            <Text
              style={{
                fontSize: typography.sizes.label,
                color: colors.text.secondary,
              }}
            >
              {medicationUnit}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: borderRadius.full,
            backgroundColor: colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: spacing.md,
          }}
        >
          <Icon
            name={medicationTypeIcon[medicationType]}
            size={26}
            color={colors.primary[400]}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
        }}
      >
        <Button
          label='Tomar agora'
          onPress={onTake}
          style={{ backgroundColor: colors.primary[600] }}
          size='lg'
        />
        <Button
          label='Pular'
          variant='primary'
          style={{
            backgroundColor: colors.primary[100],
          }}
          labelStyle={{
            color: colors.primary[800],
          }}
          onPress={onSkip}
          size='lg'
        />
      </View>
    </View>
  );
}
