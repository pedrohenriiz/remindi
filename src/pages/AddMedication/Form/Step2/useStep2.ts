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

  function generateSchedules(intervalHours: number, first: string) {
    const [hours, minutes] = first.split(':').map(Number);
    const generated: string[] = [];

    for (let i = 0; i < Math.floor(24 / intervalHours); i++) {
      const totalMinutes = hours * 60 + minutes + i * intervalHours * 60;
      const h = Math.floor(totalMinutes / 60) % 24;
      const m = totalMinutes % 60;
      generated.push(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      );
    }

    setValue('schedules', generated);
  }

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
  };
}
