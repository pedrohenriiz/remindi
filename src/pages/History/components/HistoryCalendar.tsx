import { DateData } from 'react-native-calendars';

import { Calendar } from '../../../components/Calendar';
import { useTheme } from '../../../theme/ThemeProvider';
import { Legend } from '../../../components/Calendar/Legend';
import { View } from 'react-native';
import { CalendarDayStatus } from '../../../components/Calendar/types';

export type MarkedDates = {
  [date: string]: {
    status: CalendarDayStatus;
  };
};

interface HistoryCalendarProps {
  selectedDate?: string;
  markedDates: MarkedDates;
  onDayPress?: (date: string) => void;
}

const statusLabel: Record<string, string> = {
  complete: 'Completo',
  partial: 'Parcial',
  missed: 'Perdida',
};

export default function HistoryCalendar({
  selectedDate,
  markedDates,
  onDayPress,
}: HistoryCalendarProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const statusColor: Record<CalendarDayStatus, string> = {
    complete: colors.success[500],
    partial: colors.secondary[400],
    missed: colors.error[500],
  };

  const formattedDates = Object.entries(markedDates).reduce(
    (acc, [date, { status }]) => ({
      ...acc,
      [date]: {
        selected: selectedDate === date,
        selectedColor: colors.primary[100],
        selectedTextColor: colors.primary[600],
        dots: [
          {
            key: status,
            color: statusColor[status],
          },
        ],
      },
    }),
    {} as Record<string, any>,
  );

  if (selectedDate && !formattedDates[selectedDate]) {
    formattedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.primary[100],
      selectedTextColor: colors.primary[600],
      dots: [],
    };
  }

  return (
    <Calendar.Root>
      <Calendar.Calendar
        onDayPress={(day: DateData) => onDayPress?.(day.dateString)}
        markedDates={formattedDates}
      />

      <Calendar.HorizontalLine />

      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          paddingHorizontal: 16,
          paddingBottom: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {Object.entries(statusColor).map(([status, color]) => (
          <Legend.Root key={status}>
            <Legend.Dot color={color} />
            <Legend.Label>{statusLabel[status]}</Legend.Label>
          </Legend.Root>
        ))}
      </View>
    </Calendar.Root>
  );
}
