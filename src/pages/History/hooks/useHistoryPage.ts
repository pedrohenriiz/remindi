import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  doseRepository,
  Dose,
} from '../../../database/repositories/doseRepository';

interface UseHistoryPageReturn {
  selectedDate: string;
  doses: Dose[];
  markedDates: Record<string, { status: 'complete' | 'partial' | 'missed' }>;
  isLoading: boolean;
  error: string | null;
  administeredCount: number;
  handleDayPress: (date: string) => void;
}

export function useHistoryPage(): UseHistoryPageReturn {
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [doses, setDoses] = useState<Dose[]>([]);
  const [markedDates, setMarkedDates] = useState<
    Record<string, { status: 'complete' | 'partial' | 'missed' }>
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

  const administeredCount = doses.filter(
    (d) => d.status === 'administered',
  ).length;

  return {
    selectedDate,
    doses,
    markedDates,
    isLoading,
    error,
    administeredCount,
    handleDayPress,
  };
}
