import { View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import BackButton from './BackButton';
import Logo from './Logo';

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
  handleBackButton?: () => void;
}

export function Header({
  showBackButton = false,
  title,
  handleBackButton,
}: HeaderProps) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.background.primary,
      }}
    >
      {showBackButton ? (
        <BackButton title={title} onBackButton={handleBackButton} />
      ) : (
        <Logo />
      )}
    </View>
  );
}
