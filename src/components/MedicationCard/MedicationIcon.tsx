import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useMedicationCardContext } from './MedicationCard.context';
import { Icon } from '../Common/Icon';
import { medicationTypeIcon } from './MedicationCard.styles';

export function MedicationIcon() {
  const { theme } = useTheme();
  const { borderRadius } = theme;
  const { iconColor, iconBg, medicationType } = useMedicationCardContext();

  return (
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: borderRadius.full,
        backgroundColor: iconBg,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon
        name={medicationTypeIcon[medicationType]}
        size={20}
        color={iconColor}
      />
    </View>
  );
}
