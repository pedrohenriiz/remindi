import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { DoseStatus } from '../../types/doseStatusType';
import { Icon, IconName } from '../Common/Icon';
import { useSheetContext } from './StatusBottomSheet.context';

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

interface OptionListProps {
  currentStatus: DoseStatus;
  onSelect: (status: DoseStatus) => void;
}

export function OptionList({ currentStatus, onSelect }: OptionListProps) {
  const context = useSheetContext();
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const options = STATUS_OPTIONS.filter((o) => o.status !== currentStatus);

  function getIconColors(variant: StatusOption['variant']) {
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
    <View>
      {options.map((option, index) => {
        const { bg, icon } = getIconColors(option.variant);

        return (
          <View key={option.status}>
            <TouchableOpacity
              onPress={() => {
                context?.animateOut(() => {
                  onSelect(option.status);
                  context?.onClose();
                });
              }}
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
  );
}
