import { medicationRepository } from '../database/repositories/medicationRepository';
import { doseRepository } from '../database/repositories/doseRepository';
import { scheduleNotificationsForDoses } from './notificationService';

function getTomorrowAsString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

// Gera as doses e notificações para uma data específica
// para todos os medicamentos cadastrados.
async function generateDosesForDate(date: string): Promise<void> {
  const medicationsResult = await medicationRepository.findAll();
  if (!medicationsResult.success) return;

  for (const medication of medicationsResult.data) {
    await doseRepository.generateForMedication(medication, date);
  }

  // Busca todas as doses geradas para a data e agenda notificações
  const dosesResult = await doseRepository.findByDate(date);
  if (dosesResult.success && dosesResult.data.length > 0) {
    await scheduleNotificationsForDoses(dosesResult.data);
  }
}

// Verifica se já existem doses para amanhã.
// Se não existir, gera as doses e agenda as notificações.
export async function runDailyJob(): Promise<void> {
  const tomorrow = getTomorrowAsString();

  const dosesResult = await doseRepository.findByDate(tomorrow);
  if (!dosesResult.success) return;

  // Já foram geradas doses para amanhã — nada a fazer
  if (dosesResult.data.length > 0) return;

  await generateDosesForDate(tomorrow);
}
