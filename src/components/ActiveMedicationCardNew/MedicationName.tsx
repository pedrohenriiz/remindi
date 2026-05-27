import { StyleProp, Text, TextStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface MedicationNameProps extends ViewProps {}

export default function MedicationName({
  style,
  ...rest
}: MedicationNameProps) {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const defaultStyle: StyleProp<TextStyle> = [
    {
      fontSize: typography.sizes.headline,
      fontWeight: typography.weights.bold,
      color: colors.primary[700],
    },
    style,
  ];

  return <Text style={defaultStyle} {...rest} />;
}
