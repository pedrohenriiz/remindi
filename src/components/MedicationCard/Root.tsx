import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { MedicationCardContext } from './MedicationCard.context';
import {
  statusBackground,
  statusIconBg,
  statusIconColor,
  statusTextColor,
} from './MedicationCard.styles';
import { MedicationType } from '../../types/medicationType';
import { DoseStatus } from '../../types/doseStatusType';

interface RootProps extends TouchableOpacityProps {
  medicationType: MedicationType;
  doseStatus: DoseStatus;
}

export function Root({
  children,
  medicationType,
  doseStatus,
  style,
  ...rest
}: RootProps) {
  const { theme } = useTheme();
  const { spacing, borderRadius } = theme;

  const background = statusBackground(doseStatus, theme);
  const iconBg = statusIconBg(doseStatus, theme);
  const iconColor = statusIconColor(doseStatus, theme);
  const textColor = statusTextColor(doseStatus, theme);

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: background,
      borderRadius: borderRadius.xl,
      padding: 20,
    },
    style,
  ];

  return (
    <MedicationCardContext.Provider
      value={{
        medicationType,
        doseStatus,
        iconBg,
        iconColor,
        background,
        textColor,
      }}
    >
      <TouchableOpacity
        delayLongPress={400}
        activeOpacity={0.8}
        style={defaultStyle}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    </MedicationCardContext.Provider>
  );
}
