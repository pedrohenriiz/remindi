import { View, Text, TouchableOpacity } from 'react-native';
import { FieldArrayWithId, FieldErrors } from 'react-hook-form';
import { MedicationFormData } from '../../../../validationSchema';
import { useTheme } from '../../../../../../theme/ThemeProvider';
import { TimeSlotRow } from '../../components/TimeSlotRow';
import { Icon } from '../../../../../../components/Common/Icon';

interface ManualSectionProps {
  fields: FieldArrayWithId[];
  schedules: string[];
  errors: FieldErrors<MedicationFormData>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onTimeChange: (index: number, time: string) => void;
}

export function ManualSection({
  fields,
  schedules,
  errors,
  onAdd,
  onRemove,
  onTimeChange,
}: ManualSectionProps) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  return (
    <View style={{ gap: spacing.sm }}>
      {fields.map((field, index) => (
        <TimeSlotRow
          key={field.id}
          time={schedules[index]}
          onDelete={fields.length > 1 ? () => onRemove(index) : undefined}
          onTimeChange={(time) => onTimeChange(index, time)}
        />
      ))}

      <TouchableOpacity
        onPress={onAdd}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.xs,
          paddingVertical: spacing.sm,
        }}
        testID='button-add-hour'
      >
        <Icon name='PlusCircle' size={18} color={colors.primary[500]} />
        <Text
          style={{
            fontSize: typography.sizes.label,
            fontWeight: typography.weights.semibold,
            color: colors.primary[500],
          }}
        >
          Adicionar horário
        </Text>
      </TouchableOpacity>

      {errors.schedules && (
        <Text
          style={{
            fontSize: typography.sizes.caption,
            color: colors.error[500],
          }}
        >
          Adicione ao menos um horário
        </Text>
      )}
    </View>
  );
}
