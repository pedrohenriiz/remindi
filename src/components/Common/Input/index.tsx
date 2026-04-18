import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Icon, IconName } from '../Icon';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  iconLeft?: IconName;
  iconRight?: IconName;
  onPressRight?: () => void;
}

export function Input({
  label,
  error,
  iconLeft,
  iconRight,
  editable = true,
  onPressRight,
  ...rest
}: InputProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error[500]
    : focused
      ? colors.primary[500]
      : colors.border.default;

  return (
    <View style={{ gap: spacing.xs }}>
      {label && (
        <Text
          style={{
            fontSize: typography.sizes.label,
            fontWeight: typography.weights.bold,
            color: colors.text.secondary,
            textTransform: 'uppercase',
            letterSpacing: 0.6,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: editable
            ? colors.background.secondary
            : colors.neutral[200],
          borderWidth: 1,
          borderColor,
          paddingHorizontal: spacing.md,
          gap: spacing.sm,
        }}
      >
        {iconLeft && (
          <Icon
            name={iconLeft}
            size={18}
            color={focused ? colors.primary[500] : colors.text.tertiary}
          />
        )}

        <TextInput
          style={{
            flex: 1,
            fontSize: typography.sizes.label,
            color: colors.text.primary,
            paddingVertical: spacing.md,
          }}
          placeholderTextColor={colors.text.tertiary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          {...rest}
        />

        {iconRight && (
          <TouchableOpacity onPress={onPressRight} disabled={!onPressRight}>
            <Icon
              name={iconRight}
              size={18}
              color={focused ? colors.primary[500] : colors.text.tertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
          }}
        >
          <Icon name='AlertCircle' size={14} color={colors.error[500]} />
          <Text
            style={{
              fontSize: typography.sizes.caption,
              color: colors.error[500],
            }}
          >
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
