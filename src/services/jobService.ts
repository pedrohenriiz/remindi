import { doseRepository } from '../database/repositories/doseRepository';
import { medicationRepository } from '../database/repositories/medicationRepository';
import { scheduleNotificationsForDoses } from './notificationService';

function getTomorrowAsString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

async function generateDosesForDate(date: string): Promise<void> {
  const medicationsResult = await medicationRepository.findAll();
  if (!medicationsResult.success) return;

  for (const medication of medicationsResult.data) {
    await doseRepository.generateForMedication(medication, date);
  }

  const dosesResult = await doseRepository.findByDate(date);
  if (dosesResult.success && dosesResult.data.length > 0) {
    await scheduleNotificationsForDoses(dosesResult.data);
  }
}

export async function runDailyJob(): Promise<void> {
  // 1. Marca como perdidas todas as doses pendentes cujo horário já passou
  await doseRepository.markMissedDoses();

  // 2. Gera doses e notificações para amanhã (se ainda não existirem)
  const tomorrow = getTomorrowAsString();
  const existing = await doseRepository.findByDate(tomorrow);
  if (existing.success && existing.data.length === 0) {
    await generateDosesForDate(tomorrow);
  }
}
