import { Text, TextProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface MedicationUnitProps extends TextProps {}

export function MedicationUnit({ style, ...rest }: MedicationUnitProps) {
  const { theme } = useTheme();
  const { typography, colors } = theme;

  const defaultStyles = [
    {
      fontSize: typography.sizes.caption,
      color: colors.text.tertiary,
    },
    style,
  ];

  return <Text style={defaultStyles} {...rest} />;
}
