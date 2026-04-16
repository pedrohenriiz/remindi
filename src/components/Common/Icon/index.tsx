import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IoniconsName;
  size?: number;
  color?: string;
}

export function Icon({
  name,
  size = 24,
  color = colors.neutral[500],
}: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
