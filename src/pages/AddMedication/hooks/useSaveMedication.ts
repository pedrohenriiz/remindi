import { useState } from 'react';
import { MedicationFormData } from '../validationSchema';
import { medicationRepository } from '../../../database/repositories/medicationRepository';
import { getTodayString } from '../../../utils/getTodayString';
import { doseRepository } from '../../../database/repositories/doseRepository';
import { scheduleNotificationsForDoses } from '../../../services/notificationService';

export interface SaveMedicationResultProps {
  ok: boolean;
  error?: string;
  hasDosesToday?: boolean;
  allTimesPassedToday?: boolean;
}

export function useSaveMedication() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveMedication(
    data: MedicationFormData,
  ): Promise<SaveMedicationResultProps> {
    const saveResult = await medicationRepository.save(data);
    if (!saveResult.success) return { ok: false, error: saveResult.error };

    const todayStr = getTodayString();
    await doseRepository.generateForMedication(saveResult.data, todayStr);

    const dosesResult = await doseRepository.findByDate(todayStr);
    const newDoses = dosesResult.success
      ? dosesResult.data.filter((d) => d.medicationId === saveResult.data.id)
      : [];

    if (newDoses.length > 0) {
      await scheduleNotificationsForDoses(newDoses);
    }

    return {
      ok: true,
      hasDosesToday: newDoses.length > 0,
      allTimesPassedToday:
        newDoses.length === 0 && data.weekDays.includes(new Date().getDay()),
    };
  }

  async function handleSubmit(data: MedicationFormData) {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    const result = await saveMedication(data);

    if (!result.ok && result.error) {
      setError(result.error);
    }

    setIsSaving(false);
    return result;
  }

  return { isSaving, error, handleSubmit };
}
