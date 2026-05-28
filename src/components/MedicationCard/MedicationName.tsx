import { Text, TextProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useMedicationCardContext } from './MedicationCard.context';
import { statusTextColor } from './MedicationCard.styles';

interface MedicationNameProps extends TextProps {}

export function MedicationName({ style, ...rest }: MedicationNameProps) {
  const { theme } = useTheme();
  const { typography } = theme;
  const { doseStatus } = useMedicationCardContext();

  const defaultStyles = [
    {
      fontSize: typography.sizes.label,
      fontWeight: typography.weights.semibold,
      color: statusTextColor(doseStatus, theme),
    },
    style,
  ];

  return <Text style={defaultStyles} {...rest} />;
}
