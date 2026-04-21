import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { useTheme } from '../../../theme/ThemeProvider';
import { TouchableOpacity } from 'react-native';
import { Icon } from '../../../components/Common/Icon';

export default function FABButton() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const { colors, borderRadius } = theme;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('AddMedication')}
      activeOpacity={0.8}
      style={{
        top: -30,
        width: 56,
        height: 56,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary[500],
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      }}
    >
      <Icon name='Plus' size={28} color={colors.white} />
    </TouchableOpacity>
  );
}
