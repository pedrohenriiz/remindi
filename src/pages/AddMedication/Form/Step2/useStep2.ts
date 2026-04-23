import { useEffect } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { MedicationFormData } from '../../validationSchema';

export function useStep2() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<MedicationFormData>();

  const scheduleMode = watch('scheduleMode');
  const interval = watch('interval');
  const firstDose = watch('firstDose') ?? '08:00';
  const schedules = watch('schedules');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules' as never,
  });

  // Gera todos os horários do ciclo de 24h
  function generateSchedules(intervalHours: number, first: string) {
    const [hours, minutes] = first.split(':').map(Number);
    const generated: string[] = [];
    const firstMinutes = hours * 60 + minutes;

    for (let i = 0; i < Math.floor(24 / intervalHours); i++) {
      const totalMinutes = firstMinutes + i * intervalHours * 60;
      const h = Math.floor(totalMinutes / 60) % 24;
      const m = totalMinutes % 60;
      generated.push(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      );
    }

    setValue('schedules', generated);
  }

  // Ao trocar para modo intervalo, gera os horários automaticamente
  useEffect(() => {
    if (scheduleMode === 'interval' && interval) {
      generateSchedules(interval, firstDose);
    }
  }, [scheduleMode]);

  function handleIntervalChange(value: number) {
    setValue('interval', value);
    generateSchedules(value, firstDose);
  }

  function handleFirstDoseChange(value: string) {
    setValue('firstDose', value);
    if (interval) generateSchedules(interval, value);
  }

  function handleAddSchedule() {
    append('08:00' as never);
  }

  function handleTimeChange(index: number, time: string) {
    const updated = [...schedules];
    updated[index] = time;
    setValue('schedules', updated);
  }

  return {
    control,
    errors,
    scheduleMode,
    interval,
    firstDose,
    schedules,
    fields,
    remove,
    handleIntervalChange,
    handleFirstDoseChange,
    handleAddSchedule,
    handleTimeChange,
  };
}
