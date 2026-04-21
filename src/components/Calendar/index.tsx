import React from 'react';
import { View, Text } from 'react-native';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';
import XDate from 'xdate';
import { useTheme } from '../../theme/ThemeProvider';

XDate.locales['pt-BR'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ],
  dayNames: [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};

XDate.defaultLocale = 'pt-BR';

export type CalendarDayStatus = 'complete' | 'partial' | 'missed';

export type MarkedDates = {
  [date: string]: {
    status: CalendarDayStatus;
  };
};

interface CalendarProps {
  markedDates: MarkedDates;
  onDayPress?: (date: string) => void;
  selectedDate?: string;
}

export function Calendar({
  markedDates,
  onDayPress,
  selectedDate,
}: CalendarProps) {
  const { theme } = useTheme();
  const { colors, borderRadius, typography } = theme;

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
    <View
      style={{
        backgroundColor: '#FBFBFB',
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
      }}
    >
      <RNCalendar
        firstDay={1}
        markingType='multi-dot'
        markedDates={formattedDates}
        onDayPress={(day: DateData) => onDayPress?.(day.dateString)}
        renderHeader={(date: any) => (
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
              {new Date(date)
                .toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })
                .toUpperCase()}
            </Text>
          </View>
        )}
        theme={{
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
        }}
      />

      <View
        style={{
          height: 1,
          backgroundColor: colors.primary[50],
          marginBottom: 8,
        }}
      />

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
          <View
            key={status}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: borderRadius.full,
                backgroundColor: color,
              }}
            />
            <Text
              style={{
                fontSize: typography.sizes.label,
                color: colors.neutral[600],
              }}
            >
              {status === 'complete'
                ? 'Completo'
                : status === 'partial'
                  ? 'Parcial'
                  : 'Perdida'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
