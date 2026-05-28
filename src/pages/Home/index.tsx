import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Header } from '../../components/Header';
import MedicationTitle from './MedicationTitle';
import DailyMedicationTitle from './DailyMedicationsTitle';
import { useHomePage } from './hooks/useHomePage';
import ActiveCard from './components/ActiveCard';
import HomeMedicationCard from './components/MedicationCard';
import HomeStatusBottomSheet from './components/StatusBottomSheet';

export default function HomePage() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const {
    nextDose,
    todayDoses,
    isLoading,
    error,
    bottomSheet,
    handleTake,
    handleSkip,
    handleEditStatus,
  } = useHomePage();

  // TODO: Adicionar um componente de Skeleton
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background.primary }}
      edges={['top']}
    >
      <Header />

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <MedicationTitle />

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

        {/* Próxima dose */}
        {nextDose ? (
          <ActiveCard
            medicationName={nextDose.medicationName}
            medicationUnit={nextDose.medicationUnit}
            medicationType={nextDose.medicationType as any}
            scheduledAt={`${nextDose.scheduledDate}T${nextDose.scheduledTime}:00`}
            onTake={() => handleTake(nextDose)}
            onSkip={() => handleSkip(nextDose)}
          />
        ) : (
          <View
            style={{
              backgroundColor: colors.success[50],
              borderRadius: 16,
              padding: spacing.lg,
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <Text
              style={{
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.bold,
                color: colors.success[700],
              }}
            >
              Tudo em dia!
            </Text>
            <Text
              style={{
                fontSize: typography.sizes.label,
                color: colors.success[600],
                textAlign: 'center',
              }}
            >
              Nenhuma dose pendente para hoje.
            </Text>
          </View>
        )}

        {/* Doses do dia */}
        {todayDoses.length > 0 && (
          <View style={{ gap: spacing.sm }}>
            <DailyMedicationTitle />

            {todayDoses.map((dose) => (
              <HomeMedicationCard
                key={dose.id}
                medicationName={dose.medicationName}
                medicationUnit={dose.medicationUnit}
                medicationType={dose.medicationType as any}
                doseStatus={dose.status}
                scheduleAt={`${dose.scheduledDate}T${dose.scheduledTime}:00`}
                confirmedAt={dose.confirmedAt}
                onLongPress={() => handleEditStatus(dose)}
              />
            ))}
          </View>
        )}

        {todayDoses.length === 0 && !isLoading && (
          <View
            style={{
              padding: spacing.xl,
              alignItems: 'center',
              gap: spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: typography.sizes.body,
                fontWeight: typography.weights.medium,
                color: colors.text.secondary,
                textAlign: 'center',
              }}
            >
              Nenhum medicamento para hoje
            </Text>
            <Text
              style={{
                fontSize: typography.sizes.label,
                color: colors.text.tertiary,
                textAlign: 'center',
              }}
            >
              Adicione um medicamento para começar
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom sheet de edição de status */}
      {bottomSheet.dose && <HomeStatusBottomSheet bottomSheet={bottomSheet} />}
    </SafeAreaView>
  );
}
