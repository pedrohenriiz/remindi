import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { Header } from '../../components/Header';
import { useHistoryPage } from './hooks/useHistoryPage';
import HistoryCalendar from './components/HistoryCalendar';
import { DoseSection } from './components/Dose/DoseSection';

export default function HistoryPage() {
  const { theme } = useTheme();
  const { colors, spacing, typography } = theme;

  const {
    selectedDate,
    doses,
    markedDates,
    isLoading,
    error,
    administeredDoses,
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

        <HistoryCalendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          selectedDate={selectedDate}
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

        <DoseSection
          administeredDoses={administeredDoses}
          date={formattedDateCapitalized}
          doses={doses}
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
