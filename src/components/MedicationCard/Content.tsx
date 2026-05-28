import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';

interface ContentProps extends ViewProps {}

export function Content({ style, ...rest }: ContentProps) {
  const defaultStyle: StyleProp<ViewStyle> = [{ flex: 1, gap: 2 }, style];

  return <View style={defaultStyle} {...rest} />;
}
