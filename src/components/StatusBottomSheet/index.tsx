import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { DoseStatus } from '../../database/repositories/doseRepository';
import { Icon, IconName } from '../Common/Icon';
import { StatusBadge } from '../StatusBadge';

interface StatusOption {
  status: DoseStatus;
  label: string;
  description: string;
  iconName: IconName;
  variant: 'success' | 'pending' | 'error';
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    status: 'administered',
    label: 'Tomado',
    description: 'Marcar como administrado',
    iconName: 'Check',
    variant: 'success',
  },
  {
    status: 'pending',
    label: 'Pendente',
    description: 'Voltar para aguardando',
    iconName: 'Clock',
    variant: 'pending',
  },
  {
    status: 'skipped',
    label: 'Pulado',
    description: 'Marcar como pulado',
    iconName: 'X',
    variant: 'error',
  },
  {
    status: 'missed',
    label: 'Perdido',
    description: 'Marcar como não tomado',
    iconName: 'AlertCircle',
    variant: 'error',
  },
];

interface StatusBottomSheetProps {
  visible: boolean;
  medicationName: string;
  medicationUnit: string;
  scheduledTime: string;
  currentStatus: DoseStatus;
  onSelect: (status: DoseStatus) => void;
  onClose: () => void;
}

const ANIMATION_DURATION = 280;
const SHEET_TRANSLATE_Y = 400;
const CLOSE_THRESHOLD = 80;

export function StatusBottomSheet({
  visible,
  medicationName,
  medicationUnit,
  scheduledTime,
  currentStatus,
  onSelect,
  onClose,
}: StatusBottomSheetProps) {
  const { theme } = useTheme();
  const { colors, spacing, borderRadius, typography } = theme;

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_TRANSLATE_Y)).current;

  function animateIn() {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function animateOut(callback?: () => void) {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_TRANSLATE_Y,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }

  useEffect(() => {
    if (visible) {
      sheetTranslateY.setValue(SHEET_TRANSLATE_Y);
      backdropOpacity.setValue(0);
      animateIn();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          sheetTranslateY.setValue(gestureState.dy);
          const progress = Math.max(0, 1 - gestureState.dy / SHEET_TRANSLATE_Y);
          backdropOpacity.setValue(progress);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > CLOSE_THRESHOLD) {
          animateOut(onClose);
        } else {
          Animated.parallel([
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(sheetTranslateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const options = STATUS_OPTIONS.filter((o) => o.status !== currentStatus);

  function getIconColors(variant: StatusOption['variant']): {
    bg: string;
    icon: string;
  } {
    return {
      success: {
        bg: colors.status.administered.background,
        icon: colors.status.administered.icon,
      },
      pending: {
        bg: colors.status.pending.background,
        icon: colors.status.pending.icon,
      },
      error: {
        bg: colors.status.missed.background,
        icon: colors.status.missed.icon,
      },
    }[variant];
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='none'
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            opacity: backdropOpacity,
          }}
        />
      </TouchableWithoutFeedback>

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
          transform: [{ translateY: sheetTranslateY }],
        }}
      >
        <View
          style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 12 }}
          {...panResponder.panHandlers}
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

        <View
          style={{
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border.default,
            gap: spacing.xs,
          }}
        >
          <Text
            style={{
              fontSize: typography.sizes.caption,
              color: colors.text.tertiary,
            }}
          >
            Alterar status
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text
              style={{
                fontSize: typography.sizes.title,
                fontWeight: typography.weights.semibold,
                color: colors.text.primary,
              }}
            >
              {medicationName}
            </Text>

            <StatusBadge status={currentStatus} />
          </View>

          <Text
            style={{
              fontSize: typography.sizes.caption,
              color: colors.text.tertiary,
            }}
          >
            {medicationUnit} • {scheduledTime}
          </Text>
        </View>

        {/* Opções */}
        <View>
          {options.map((option, index) => {
            const { bg, icon } = getIconColors(option.variant);

            return (
              <View key={option.status}>
                <TouchableOpacity
                  onPress={() => onSelect(option.status)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                    paddingVertical: 14,
                    paddingHorizontal: spacing.lg,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon name={option.iconName} size={16} color={icon} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: typography.sizes.label,
                        fontWeight: typography.weights.medium,
                        color: colors.text.primary,
                      }}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: typography.sizes.caption,
                        color: colors.text.tertiary,
                        marginTop: 1,
                      }}
                    >
                      {option.description}
                    </Text>
                  </View>
                </TouchableOpacity>

                {index < options.length - 1 && (
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: colors.border.default,
                      marginHorizontal: spacing.lg,
                    }}
                  />
                )}
              </View>
            );
          })}
        </View>
      </Animated.View>
    </Modal>
  );
}
