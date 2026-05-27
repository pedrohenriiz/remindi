import { useTheme } from '../../../theme/ThemeProvider';
import { useButtonContext } from './Button.context';
import { Icon, IconName } from '../Icon';
import { iconColors, iconSizes } from './Button.styles';

interface ButtonIconProps {
  name: IconName;
}

export function ButtonIcon({ name }: ButtonIconProps) {
  const { theme } = useTheme();
  const { variant, size } = useButtonContext();

  return (
    <Icon
      name={name}
      size={iconSizes[size]}
      color={iconColors(variant, theme)}
    />
  );
}
