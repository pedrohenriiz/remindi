import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { medicationSchema, MedicationFormData } from './validationSchema';
import { medicationRepository } from '../../database/repositories/medicationRepository';
import { doseRepository } from '../../database/repositories/doseRepository';
import { scheduleNotificationsForDoses } from '../../services/notificationService';
import { RootStackParamList } from '../../navigation/types';
import { Step1 } from './Form/Step1';
import { Step2 } from './Form/Step2';

export default function AddMedicationPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      amount: '',
      type: 'tablet',
      unit: 'comprimido(s)',
      weekDays: [0, 1, 2, 3, 4],
      scheduleMode: 'manual',
      schedules: ['08:00'],
      interval: 8,
      firstDose: '08:00',
    },
  });

  function handleNextStep() {
    setStep(2);
  }

  function handlePreviousStep() {
    setStep(1);
  }

  async function handleSubmit(data: MedicationFormData) {
    if (isSaving) return;

    setIsSaving(true);
    setError(null);

    // Salva o medicamento
    const saveResult = await medicationRepository.save(data);
    if (!saveResult.success) {
      setError(saveResult.error);
      setIsSaving(false);
      return;
    }

    // Gera as doses do dia atual
    const today = new Date().toISOString().split('T')[0];
    await doseRepository.generateForMedication(saveResult.data, today);

    // Busca as doses geradas e agenda as notificações
    const dosesResult = await doseRepository.findByDate(today);
    if (dosesResult.success) {
      const newDoses = dosesResult.data.filter(
        (d) => d.medicationId === saveResult.data.id,
      );
      await scheduleNotificationsForDoses(newDoses);
    }

    navigation.goBack();
    setIsSaving(false);
  }

  return (
    <FormProvider {...methods}>
      {step === 1 ? (
        <Step1 onNext={handleNextStep} />
      ) : (
        <Step2
          onBack={handlePreviousStep}
          onSubmit={methods.handleSubmit(handleSubmit)}
          isSaving={isSaving}
          error={error}
        />
      )}
    </FormProvider>
  );
}
