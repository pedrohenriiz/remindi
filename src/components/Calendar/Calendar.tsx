import { Calendar as RNCalendar, CalendarProps } from 'react-native-calendars';
import { useTheme } from '../../theme/ThemeProvider';
import { Text, View } from 'react-native';
import XDate from 'xdate';

interface CustomCalendarProps extends CalendarProps {}

export function CalendarHeader(date?: XDate) {
  const { theme } = useTheme();
  const { colors, typography } = theme;

  const formatted = date
    ? new Date(date.getTime())
        .toLocaleDateString('pt-BR', {
          month: 'long',
          year: 'numeric',
        })
        .toUpperCase()
    : '';

  return (
    <View style={{ paddingVertical: 8 }}>
      <Text
        style={{
          fontSize: typography.sizes.caption,
          fontWeight: typography.weights.semibold,
          color: colors.text.tertiary,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
        }}
      >
        {formatted}
      </Text>
    </View>
  );
}

export default function Calendar({
  theme,
  markedDates,
  ...rest
}: CustomCalendarProps) {
  const { theme: systemTheme } = useTheme();
  const { colors, typography } = systemTheme;

  const defaultTheme = {
    calendarBackground: '#FBFBFB',
    textSectionTitleColor: colors.text.tertiary,
    dayTextColor: colors.text.primary,
    todayTextColor: colors.neutral[900],
    todayDotColor: 'transparent',
    todayBackgroundColor: 'transparent',
    selectedDayTextColor: colors.white,
    selectedDayBackgroundColor: colors.primary[500],
    arrowColor: colors.primary[500],
    monthTextColor: colors.text.primary,
    textDisabledColor: colors.neutral[300],
    textDayFontSize: typography.sizes.label,
    textMonthFontSize: typography.sizes.label,
    textDayHeaderFontSize: typography.sizes.caption,
    textDayFontWeight: typography.weights.regular,
    textMonthFontWeight: typography.weights.bold,
    textDayHeaderFontWeight: typography.weights.semibold,
    ...theme,
  };

  return (
    <RNCalendar
      firstDay={1}
      markingType='multi-dot'
      markedDates={markedDates}
      renderHeader={CalendarHeader}
      theme={defaultTheme}
      {...rest}
    />
  );
}
