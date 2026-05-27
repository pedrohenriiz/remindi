import { Image, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import RemindiLogo from '../../assets/logo.png';

export default function Logo() {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: borderRadius.full,
          backgroundColor: colors.primary[100],
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Image
          source={RemindiLogo}
          style={{ width: 20, height: 20 }}
          resizeMode='contain'
        />
      </View>
      <Text
        style={{
          fontSize: typography.sizes.title,
          fontWeight: typography.weights.bold,
          color: colors.primary[900],
        }}
      >
        Remindi
      </Text>
    </View>
  );
}
