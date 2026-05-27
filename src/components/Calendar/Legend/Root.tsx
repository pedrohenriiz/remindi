import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';

interface LegendRootProps extends ViewProps {}

export default function LegendRoot({ style, ...rest }: LegendRootProps) {
  const defaultStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
