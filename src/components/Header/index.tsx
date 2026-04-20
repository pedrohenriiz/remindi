import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { Icon } from '../Common/Icon';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

export function Header({ showBackButton = false, title }: HeaderProps) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background.primary,
      }}
    >
      {showBackButton ? (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
          }}
        >
          <Icon name='ChevronLeft' size={20} color={colors.primary[500]} />
          <Text
            style={{
              fontSize: typography.sizes.label,
              fontWeight: typography.weights.medium,
              color: colors.primary[500],
            }}
          >
            {title ?? 'Voltar'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: borderRadius.full,
              backgroundColor: colors.primary[100],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name='Flower' size={20} color={colors.primary[500]} />
          </View>
          <Text
            style={{
              fontSize: typography.sizes.title,
              fontWeight: typography.weights.bold,
              color: colors.primary[900],
            }}
          >
            Remindi
          </Text>
        </View>
      )}
    </View>
  );
}
