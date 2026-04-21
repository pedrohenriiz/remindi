import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Calendar } from '../../components/Calendar';
import { MedicationCard } from '../../components/MedicationCard';
import { Header } from '../../components/Header';
import { useHistoryPage } from './hooks/useHistoryPage';

export default function HistoryPage() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const {
    selectedDate,
    doses,
    markedDates,
    isLoading,
    error,
    administeredCount,
    handleDayPress,
  } = useHistoryPage();

  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString(
    'pt-BR',
    { weekday: 'long', day: '2-digit', month: 'long' },
  );
  const formattedDateCapitalized =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const currentMonth = new Date()
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .toUpperCase();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.white }}
      edges={['top']}
    >
      <Header />

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
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
            {currentMonth}
          </Text>
          <Text
            style={{
              fontSize: typography.sizes.headline,
              fontWeight: typography.weights.bold,
              color: colors.text.primary,
            }}
          >
            Histórico
          </Text>
        </View>

        <Calendar
          markedDates={markedDates}
          selectedDate={selectedDate}
          onDayPress={handleDayPress}
        />

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

        {isLoading ? (
          <ActivityIndicator color={colors.primary[500]} />
        ) : doses.length > 0 ? (
          <View style={{ gap: spacing.md }}>
            <View style={{ gap: spacing.xs }}>
              <Text
                style={{
                  fontSize: typography.sizes.body,
                  fontWeight: typography.weights.semibold,
                  color: colors.primary[800],
                }}
              >
                {formattedDateCapitalized}
              </Text>
              <Text
                style={{
                  fontSize: typography.sizes.label,
                  color: colors.neutral[500],
                }}
              >
                {administeredCount} de {doses.length} doses administradas
              </Text>
            </View>

            <View style={{ gap: spacing.sm }}>
              {doses.map((dose) => (
                <MedicationCard
                  key={dose.id}
                  medicationName={dose.medicationName}
                  medicationUnit={dose.medicationUnit}
                  medicationType={dose.medicationType as any}
                  doseStatus={dose.status}
                  scheduleAt={`${dose.scheduledDate}T${dose.scheduledTime}:00`}
                  confirmedAt={dose.confirmedAt}
                />
              ))}
            </View>
          </View>
        ) : (
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
              Nenhuma dose registrada
            </Text>
            <Text
              style={{
                fontSize: typography.sizes.label,
                color: colors.text.tertiary,
                textAlign: 'center',
              }}
            >
              Selecione outro dia no calendário
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
