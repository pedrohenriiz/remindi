import { useState } from 'react';
import { InputContext } from './Input.context';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';

interface RootProps extends ViewProps {
  error?: string;
  editable?: boolean;
}

export function Root({
  children,
  error,
  editable = true,
  style,
  ...rest
}: RootProps) {
  const { theme } = useTheme();
  const { spacing } = theme;

  const [focused, setFocused] = useState(false);

  const defaultStyle: StyleProp<ViewStyle> = [
    {
      gap: spacing.xs,
    },
    style,
  ];

  return (
    <InputContext.Provider value={{ focused, setFocused, error, editable }}>
      <View style={defaultStyle} {...rest}>
        {children}
      </View>
    </InputContext.Provider>
  );
}
