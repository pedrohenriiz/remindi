import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Dose,
  doseRepository,
  DoseStatus,
} from '../../../database/repositories/doseRepository';
import { cancelDoseNotifications } from '../../../services/notificationService';

interface UseHomePageReturn {
  nextDose: Dose | null;
  todayDoses: Dose[];
  isLoading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  handleTake: (dose: Dose) => void;
  handleSkip: (dose: Dose) => void;
  handleEditStatus: (dose: Dose) => void;
  bottomSheet: {
    visible: boolean;
    dose: Dose;
    onSelect: (status: DoseStatus) => void;
    onClose: () => void;
  };
}

export function useHomePage(): UseHomePageReturn {
  const [nextDose, setNextDose] = useState<Dose | null>(null);
  const [todayDoses, setTodayDoses] = useState<Dose[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bottomSheetDose, setBottomSheetDose] = useState<Dose | null>(null);

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

    // Cancela notificações pendentes quando a dose é resolvida
    if (status !== 'pending') {
      await cancelDoseNotifications(dose.id);
    }

    setTodayDoses((prev) =>
      prev.map((d) => (d.id === dose.id ? result.data : d)),
    );

    const nextResult = await doseRepository.findNextPending();
    if (nextResult.success) {
      setNextDose(nextResult.data);
    }
  }

  function handleTake(dose: Dose) {
    Alert.alert(
      'Confirmar dose',
      `Confirmar que tomou ${dose.medicationName} (${dose.medicationUnit})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => updateDoseStatus(dose, 'administered'),
        },
      ],
    );
  }

  function handleSkip(dose: Dose) {
    Alert.alert(
      'Pular dose',
      `Tem certeza que quer pular ${dose.medicationName} das ${dose.scheduledTime}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Pular',
          style: 'destructive',
          onPress: () => updateDoseStatus(dose, 'skipped'),
        },
      ],
    );
  }

  function handleEditStatus(dose: Dose) {
    setBottomSheetDose(dose);
  }

  function handleBottomSheetSelect(status: DoseStatus) {
    if (bottomSheetDose) {
      updateDoseStatus(bottomSheetDose, status);
    }
    setBottomSheetDose(null);
  }

  function handleBottomSheetClose() {
    setBottomSheetDose(null);
  }

  return {
    nextDose,
    todayDoses,
    isLoading,
    error,
    loadData,
    handleTake,
    handleSkip,
    handleEditStatus,
    bottomSheet: {
      visible: bottomSheetDose !== null,
      dose: bottomSheetDose!,
      onSelect: handleBottomSheetSelect,
      onClose: handleBottomSheetClose,
    },
  };
}
