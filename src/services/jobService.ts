import { medicationRepository } from '../database/repositories/medicationRepository';
import { doseRepository } from '../database/repositories/doseRepository';
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

  const tomorrow = getTomorrowAsString();

  // 2. Busca doses já existentes para amanhã
  const existing = await doseRepository.findByDate(tomorrow);
  if (!existing.success) return;

  if (existing.data.length === 0) {
    // Nenhuma dose para amanhã — gera para todos os medicamentos
    await generateDosesForDate(tomorrow);
  } else {
    // Já existem doses para amanhã, mas verifica se há medicamentos
    // recorrentes que ainda não têm doses geradas para esse dia.
    // Isso cobre o caso de um medicamento recorrente cadastrado depois
    // do job já ter rodado para amanhã.
    const medicationsResult = await medicationRepository.findAll();
    if (!medicationsResult.success) return;

    const existingMedicationIds = new Set(
      existing.data.map((d) => d.medicationId),
    );

    const missingRecurring = medicationsResult.data.filter(
      (m) => m.recurring && !existingMedicationIds.has(m.id),
    );

    for (const medication of missingRecurring) {
      await doseRepository.generateForMedication(medication, tomorrow);
    }

    if (missingRecurring.length > 0) {
      const dosesResult = await doseRepository.findByDate(tomorrow);
      if (dosesResult.success && dosesResult.data.length > 0) {
        await scheduleNotificationsForDoses(dosesResult.data);
      }
    }
  }
}
