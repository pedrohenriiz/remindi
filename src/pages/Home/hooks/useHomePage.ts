import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Dose,
  doseRepository,
} from '../../../database/repositories/doseRepository';
import { DoseStatus } from '../../../types/doseStatusType';

interface UseHomePageReturn {
  nextDose: Dose | null;
  todayDoses: Dose[];
  isLoading: boolean;
  error: string | null;
  handleTake: (dose: Dose) => Promise<void>;
  handleSkip: (dose: Dose) => Promise<void>;
}

export function useHomePage(): UseHomePageReturn {
  const [nextDose, setNextDose] = useState<Dose | null>(null);
  const [todayDoses, setTodayDoses] = useState<Dose[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    const today = new Date().toISOString().split('T')[0];

    const [nextResult, todayResult] = await Promise.all([
      doseRepository.findNextPending(),
      doseRepository.findByDate(today),
    ]);

    if (!nextResult.success) {
      setError(nextResult.error);
      setIsLoading(false);
      return;
    }

    if (!todayResult.success) {
      setError(todayResult.error);
      setIsLoading(false);
      return;
    }

    setNextDose(nextResult.data);
    setTodayDoses(todayResult.data);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  async function updateDoseStatus(dose: Dose, status: DoseStatus) {
    const result = await doseRepository.updateStatus(dose.id, status);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setTodayDoses((prev) =>
      prev.map((d) => (d.id === dose.id ? result.data : d)),
    );

    const nextResult = await doseRepository.findNextPending();
    if (nextResult.success) {
      setNextDose(nextResult.data);
    }
  }

  async function handleTake(dose: Dose) {
    await updateDoseStatus(dose, 'administered');
  }

  async function handleSkip(dose: Dose) {
    await updateDoseStatus(dose, 'skipped');
  }

  return {
    nextDose,
    todayDoses,
    isLoading,
    error,
    handleTake,
    handleSkip,
  };
}
