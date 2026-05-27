import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  doseRepository,
  Dose,
} from '../../../database/repositories/doseRepository';

type MarkedDateProps = {
  status: 'complete' | 'partial' | 'missed';
};

interface UseHistoryPageReturn {
  selectedDate: string;
  doses: Dose[];
  markedDates: Record<string, MarkedDateProps>;
  isLoading: boolean;
  error: string | null;
  administeredDoses: number;
  handleDayPress: (date: string) => void;
}

export function useHistoryPage(): UseHistoryPageReturn {
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [doses, setDoses] = useState<Dose[]>([]);
  const [markedDates, setMarkedDates] = useState<
    Record<string, MarkedDateProps>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadMarkedDates() {
    const result = await doseRepository.getMarkedDates();
    if (result.success) {
      setMarkedDates(result.data);
    }
  }

  async function loadDosesForDate(date: string) {
    setIsLoading(true);
    setError(null);

    const result = await doseRepository.findByDate(date);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setDoses(result.data);
    setIsLoading(false);
  }

  async function handleDayPress(date: string) {
    setSelectedDate(date);
    await loadDosesForDate(date);
  }

  useFocusEffect(
    useCallback(() => {
      loadMarkedDates();
      loadDosesForDate(selectedDate);
    }, []),
  );

  const administeredDoses = doses.filter(
    (dose) => dose.status === 'administered',
  ).length;

  return {
    selectedDate,
    doses,
    markedDates,
    isLoading,
    error,
    administeredDoses,
    handleDayPress,
  };
}
