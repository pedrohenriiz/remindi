import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '../components/Common/Icon';
import { useTheme } from '../theme/ThemeProvider';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  show: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

interface ToastConfig {
  iconName: IconName;
  getColors: (colors: any) => {
    bg: string;
    text: string;
    iconBg: string;
    iconColor: string;
  };
}

const TOAST_CONFIG: Record<ToastType, ToastConfig> = {
  success: {
    iconName: 'CheckCircle',
    getColors: (colors) => ({
      bg: colors.status.administered.background,
      text: colors.status.administered.text,
      iconBg: colors.success[100],
      iconColor: colors.status.administered.icon,
    }),
  },
  error: {
    iconName: 'XCircle',
    getColors: (colors) => ({
      bg: colors.status.missed.background,
      text: colors.status.missed.text,
      iconBg: colors.error[100],
      iconColor: colors.status.missed.icon,
    }),
  },
  info: {
    iconName: 'Info',
    getColors: (colors) => ({
      bg: colors.status.pending.background,
      text: colors.status.pending.text,
      iconBg: colors.primary[100],
      iconColor: colors.status.pending.icon,
    }),
  },
};

function Toast({
  message,
  type,
  opacity,
  translateY,
}: {
  message: string;
  type: ToastType;
  opacity: Animated.Value;
  translateY: Animated.Value;
}) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;
  const insets = useSafeAreaInsets();

  const config = TOAST_CONFIG[type];
  const { bg, text, iconBg, iconColor } = config.getColors(colors);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top + spacing.sm,
        left: spacing.lg,
        right: spacing.lg,
        zIndex: 9999,
        opacity,
        transform: [{ translateY }],
      }}
      pointerEvents='none'
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          backgroundColor: bg,
          borderRadius: borderRadius.lg,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: borderRadius.full,
            backgroundColor: iconBg,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name={config.iconName} size={18} color={iconColor} />
        </View>

        <Text
          style={{
            flex: 1,
            fontSize: typography.sizes.label,
            fontWeight: typography.weights.medium,
            color: text,
          }}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const [visible, setVisible] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    ({ message, type = 'success', duration = 3000 }: ToastOptions) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setMessage(message);
      setType(type);
      setVisible(true);

      opacity.setValue(0);
      translateY.setValue(-20);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      timeoutRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -20,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => setVisible(false));
      }, duration);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {visible && (
        <Toast
          message={message}
          type={type}
          opacity={opacity}
          translateY={translateY}
        />
      )}
    </ToastContext.Provider>
  );
}
