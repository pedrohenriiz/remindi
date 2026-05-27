import { ActivityIndicator } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useButtonContext } from './Button.context';
import { iconColors } from './Button.styles';

export function Spinner() {
  const { theme } = useTheme();
  const { variant, loading } = useButtonContext();

  if (!loading) return null;

  return <ActivityIndicator size='small' color={iconColors(variant, theme)} />;
}
