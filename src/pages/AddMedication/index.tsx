import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { medicationSchema, MedicationFormData } from './validationSchema';

import { Step1 } from './Form/Step1';
import { Step2 } from './Form/Step2';
import { useSaveMedication } from './hooks/useSaveMedication';
import { usePostSaveNavigation } from './hooks/useSaveNavigation';

export default function AddMedicationPage() {
  const [step, setStep] = useState(1);

  const { isSaving, error, handleSubmit: saveMedication } = useSaveMedication();
  const { handlePostSave } = usePostSaveNavigation();

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
      recurring: false,
    },
  });

  function handleNextStep() {
    setStep(2);
  }

  function handlePreviousStep() {
    setStep(1);
  }

  async function handleSubmit(data: MedicationFormData) {
    const result = await saveMedication(data);
    if (result) handlePostSave(data.name, result);
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
