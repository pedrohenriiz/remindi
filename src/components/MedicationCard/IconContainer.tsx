import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useMedicationCardContext } from './MedicationCard.context';

interface ContainerProps extends ViewProps {}

export function IconContainer({ style, ...rest }: ContainerProps) {
  const { theme } = useTheme();
  const { borderRadius } = theme;

  const { iconBg } = useMedicationCardContext();

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      width: 42,
      height: 42,
      borderRadius: borderRadius.full,
      backgroundColor: iconBg,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
