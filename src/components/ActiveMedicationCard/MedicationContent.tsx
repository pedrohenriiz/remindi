import { StyleProp, View, ViewStyle, type ViewProps } from 'react-native';

interface MedicationContentProps extends ViewProps {}

export default function MedicationContent({
  style,
  ...rest
}: MedicationContentProps) {
  const defaultStyle: StyleProp<ViewStyle> = [{ gap: 2 }, style];

  return <View style={defaultStyle} {...rest} />;
}
