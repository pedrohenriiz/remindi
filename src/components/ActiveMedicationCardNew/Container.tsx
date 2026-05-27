import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';

interface ContainerProps extends ViewProps {}

export default function Container({ style, ...rest }: ContainerProps) {
  const defaultStyle: StyleProp<ViewStyle> = [
    {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    style,
  ];

  return <View style={defaultStyle} {...rest} />;
}
