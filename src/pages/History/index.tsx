import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Calendar, MarkedDates } from '../../components/Calendar';
import { MedicationCard } from '../../components/MedicationCard';
import { Header } from '../../components/Header';

const MOCK_MARKED_DATES: MarkedDates = {
  '2026-04-01': { status: 'complete' },
  '2026-04-02': { status: 'complete' },
  '2026-04-03': { status: 'partial' },
  '2026-04-06': { status: 'missed' },
  '2026-04-07': { status: 'complete' },
  '2026-04-08': { status: 'complete' },
  '2026-04-09': { status: 'partial' },
  '2026-04-19': { status: 'complete' },
  '2026-04-20': { status: 'complete' },
};

const MOCK_DOSES: Record<
  string,
  {
    id: string;
    medicationName: string;
    medicationUnit: string;
    medicationType: 'tablet' | 'capsule' | 'liquid' | 'other';
    doseStatus: 'administered' | 'pending' | 'skipped' | 'missed';
    scheduleAt: string;
    confirmedAt?: string;
  }[]
> = {
  '2026-04-20': [
    {
      id: '1',
      medicationName: 'Lisinopril',
      medicationUnit: '10mg • 1 Comprimido',
      medicationType: 'tablet',
      doseStatus: 'administered',
      scheduleAt: '2026-04-20T08:00:00.000Z',
      confirmedAt: '2026-04-20T08:05:00.000Z',
    },
    {
      id: '2',
      medicationName: 'Lisinopril',
      medicationUnit: '10mg • 1 Comprimido',
      medicationType: 'tablet',
      doseStatus: 'administered',
      scheduleAt: '2026-04-20T09:00:00.000Z',
      confirmedAt: '2026-04-20T09:05:00.000Z',
    },
    {
      id: '3',
      medicationName: 'Lisinopril',
      medicationUnit: '10mg • 1 Comprimido',
      medicationType: 'tablet',
      doseStatus: 'pending',
      scheduleAt: '2026-04-20T20:00:00.000Z',
    },
  ],
  '2026-04-09': [
    {
      id: '4',
      medicationName: 'Vitamina D3',
      medicationUnit: '2000 UI • 1 Cápsula',
      medicationType: 'capsule',
      doseStatus: 'administered',
      scheduleAt: '2026-04-09T08:00:00.000Z',
      confirmedAt: '2026-04-09T08:10:00.000Z',
    },
    {
      id: '5',
      medicationName: 'Metformina',
      medicationUnit: '500mg • 1 Comprimido',
      medicationType: 'tablet',
      doseStatus: 'skipped',
      scheduleAt: '2026-04-09T20:00:00.000Z',
    },
  ],
};

export default function HistoryPage() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  const doses = MOCK_DOSES[selectedDate] ?? [];
  const totalDoses = doses.length;
  const administeredDoses = doses.filter(
    (d) => d.doseStatus === 'administered',
  ).length;

  const formattedDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString(
    'pt-BR',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    },
  );

  const formattedDateCapitalized =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const currentMonth = new Date()
    .toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
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
          markedDates={MOCK_MARKED_DATES}
          selectedDate={selectedDate}
          onDayPress={setSelectedDate}
        />

        {doses.length > 0 ? (
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
                {administeredDoses} de {totalDoses} doses administradas
              </Text>
            </View>

            <View style={{ gap: spacing.sm }}>
              {doses.map((dose) => (
                <MedicationCard
                  key={dose.id}
                  medicationName={dose.medicationName}
                  medicationUnit={dose.medicationUnit}
                  medicationType={dose.medicationType}
                  doseStatus={dose.doseStatus}
                  scheduleAt={dose.scheduleAt}
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
