import React from 'react';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  LucideIcon,
  Pill,
  Clock,
  CheckCircle,
  XCircle,
  MinusCircle,
  Trash2,
  Plus,
  Home,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Pencil,
  Search,
  Bell,
  User,
  PillBottle,
  Droplet,
} from 'lucide-react-native';

export const iconMap = {
  Pill,
  Clock,
  CheckCircle,
  XCircle,
  MinusCircle,
  Trash2,
  Plus,
  Home,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Pencil,
  Search,
  Bell,
  User,
  PillBottle,
  Droplet,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, color, strokeWidth = 1.5 }: IconProps) {
  const { theme } = useTheme();

  const LucideIconComponent = iconMap[name] as LucideIcon;

  return (
    <LucideIconComponent
      size={size}
      color={color ?? theme.colors.text.tertiary}
      strokeWidth={strokeWidth}
    />
  );
}
