import { View, Text, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeProvider';
import { Header } from '../../../../components/Header';
import { StepIndicator } from '../../../../components/StepIndicator';
import { ScheduleModeToggle } from '../../../../components/ScheduleModeToggle';
import { useStep2 } from './useStep2';
import { WeekDaysSection } from './sections/WeekDaysSection';
import { ManualSection } from './sections/ManualSection';
import { IntervalSection } from './sections/IntervalSection';
import { Button } from '../../../../components/Common/Button';

interface Step2Props {
  isSaving?: boolean;
  error?: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

// @TODO: Refatorar
export function Step2({
  onBack,
  onSubmit,
  isSaving = false,
  error = null,
}: Step2Props) {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const {
    control,
    errors,
    scheduleMode,
    interval,
    firstDose,
    schedules,
    fields,
    remove,
    handleIntervalChange,
    handleFirstDoseChange,
    handleAddSchedule,
    handleTimeChange,
  } = useStep2();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      edges={['top', 'bottom']}
    >
      <Header showBackButton handleBackButton={onBack} />

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator totalSteps={2} currentStep={2} />

        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              fontSize: typography.sizes.caption,
              fontWeight: typography.weights.semibold,
              color: colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            }}
          >
            Etapa 2 de 2
          </Text>
          <Text
            style={{
              fontSize: typography.sizes.headline,
              fontWeight: typography.weights.bold,
              color: colors.text.primary,
            }}
          >
            Quando tomar
          </Text>
          <Text
            style={{
              fontSize: typography.sizes.label,
              color: colors.text.tertiary,
            }}
          >
            Defina os dias e horários.
          </Text>
        </View>

        <WeekDaysSection control={control} errors={errors} />

        <View style={{ gap: spacing.sm }}>
          <Text
            style={{
              fontSize: typography.sizes.caption,
              fontWeight: typography.weights.semibold,
              color: colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            }}
          >
            Horários
          </Text>

          <Controller
            control={control}
            name='scheduleMode'
            render={({ field: { onChange, value } }) => (
              <ScheduleModeToggle mode={value} onChange={onChange} />
            )}
          />

          {scheduleMode === 'manual' ? (
            <ManualSection
              fields={fields}
              schedules={schedules}
              errors={errors}
              onAdd={handleAddSchedule}
              onRemove={remove}
              onTimeChange={handleTimeChange}
            />
          ) : (
            <IntervalSection
              interval={interval}
              firstDose={firstDose}
              schedules={schedules}
              onIntervalChange={handleIntervalChange}
              onFirstDoseChange={handleFirstDoseChange}
            />
          )}
        </View>
      </ScrollView>

      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        {error && (
          <Text
            style={{
              fontSize: typography.sizes.caption,
              color: colors.error[500],
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
        )}

        <Button.Root
          onPress={onSubmit}
          testID='button-save'
          disabled={isSaving}
          loading={isSaving}
          size='lg'
        >
          <Button.Spinner />
          <Button.Label>Salvar</Button.Label>
        </Button.Root>
      </View>
    </SafeAreaView>
  );
}
