import { Animated, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useSheetContext } from './StatusBottomSheet.context';

export function Container({ children }: { children: React.ReactNode }) {
  const context = useSheetContext();
  const { theme } = useTheme();
  const { colors, borderRadius } = theme;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 32,
        backgroundColor: colors.background.primary,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        transform: [{ translateY: context?.sheetTranslateY || 0 }],
      }}
    >
      {/* Drag handle */}
      <View
        style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 12 }}
        {...context?.panResponder?.panHandlers}
      >
        <View
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.border.strong,
          }}
        />
      </View>

      {children}
    </Animated.View>
  );
}
