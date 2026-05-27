import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';

interface ChipContainerProps extends ViewProps {}

export default function ChipContainer({ style, ...rest }: ChipContainerProps) {
  const defaultStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      gap: 16,
      paddingHorizontal: 16,
      paddingBottom: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
