import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface MedicationUnitProps extends TextProps {}

export default function MedicationUnit({
  style,
  ...rest
}: MedicationUnitProps) {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const defaultStyle: StyleProp<TextStyle> = [
    {
      fontSize: typography.sizes.label,
      color: colors.text.secondary,
    },
    style,
  ];

  return <Text style={defaultStyle} {...rest} />;
}
