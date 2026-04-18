import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/ThemeProvider';

export type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IoniconsName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 24, color }: IconProps) {
  const { theme } = useTheme();

  const iconColor = color ?? theme.colors.text.tertiary;

  return <Ionicons name={name} size={size} color={iconColor} />;
}
