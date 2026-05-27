import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '../Common/Icon';

interface BackButtonProps extends TouchableOpacityProps {
  title?: string;
  onBackButton?: () => void;
}

export default function BackButton({
  title,
  onBackButton,
  ...rest
}: BackButtonProps) {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const backButtonLabel = title ?? 'Voltar';

  return (
    <TouchableOpacity
      onPress={() => {
        if (onBackButton) {
          return onBackButton();
        }
        return navigation.goBack();
      }}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
      }}
      testID='button-goback'
      {...rest}
    >
      <Icon name='ChevronLeft' size={20} color={colors.primary[500]} />
      <Text
        style={{
          fontSize: typography.sizes.label,
          fontWeight: typography.weights.medium,
          color: colors.primary[500],
        }}
      >
        {backButtonLabel}
      </Text>
    </TouchableOpacity>
  );
}
