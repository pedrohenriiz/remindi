import { z } from 'zod';

export const medicationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  amount: z.string().min(1, 'Dosagem é obrigatória'),
  type: z.enum(['tablet', 'capsule', 'liquid', 'other']),
  unit: z.string(),
  weekDays: z.array(z.number()).min(1, 'Selecione ao menos um dia'),
  scheduleMode: z.enum(['manual', 'interval']),
  schedules: z.array(z.string()).min(1, 'Adicione ao menos um horário'),
  interval: z.number().optional(),
  firstDose: z.string().optional(),
});

export type MedicationFormData = z.infer<typeof medicationSchema>;
