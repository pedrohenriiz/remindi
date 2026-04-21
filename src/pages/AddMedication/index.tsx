import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Alert } from 'react-native';
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

    const saveResult = await medicationRepository.save(data);
    if (!saveResult.success) {
      setError(saveResult.error);
      setIsSaving(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    await doseRepository.generateForMedication(saveResult.data, today);

    const dosesResult = await doseRepository.findByDate(today);
    const newDoses = dosesResult.success
      ? dosesResult.data.filter((d) => d.medicationId === saveResult.data.id)
      : [];

    if (newDoses.length > 0) {
      await scheduleNotificationsForDoses(newDoses);
      navigation.goBack();
    } else {
      // Nenhuma dose gerada para hoje — avisa o usuário antes de voltar
      Alert.alert(
        'Medicamento salvo',
        'Todos os horários de hoje já passaram. As doses aparecerão a partir de amanhã.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    }

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
