import {
  StyleProp,
  View,
  Text,
  ViewProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import React from 'react';

interface HeaderChipProps extends ViewProps {
  children?: React.ReactNode;
}

export default function HeaderChip({
  style,
  children,
  ...rest
}: HeaderChipProps) {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const containerStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    style,
  ];

  const textStyle: StyleProp<TextStyle> = {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semibold,
    color: colors.primary[700],
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  };

  return (
    <View style={containerStyle} {...rest}>
      {React.Children.map(children, (child) =>
        typeof child === 'string' || typeof child === 'number' ? (
          <Text style={textStyle}>{child}</Text>
        ) : (
          child
        ),
      )}
    </View>
  );
}
