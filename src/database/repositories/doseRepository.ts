import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
import { getDatabase } from '../index';
import { Medication } from './medicationRepository';
import { Result, ok, fail } from '../../utils/result';
import { IDoseRepository } from './doseRepositoryInterface';

export type DoseStatus = 'pending' | 'administered' | 'skipped' | 'missed';

export interface Dose {
  id: string;
  medicationId: string;
  medicationName: string;
  medicationUnit: string;
  medicationType: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:MM
  status: DoseStatus;
  confirmedAt?: string;
}

// Verifica se uma data cai em um dos dias da semana do medicamento
// weekDays: 0 = domingo, 1 = segunda, ..., 6 = sábado
function isScheduledForDate(weekDays: number[], date: string): boolean {
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  return weekDays.includes(dayOfWeek);
}

function todayAsString(): string {
  return new Date().toISOString().split('T')[0];
}

class DoseRepository implements IDoseRepository {
  private generateId(): string {
    return Crypto.randomUUID();
  }

  private rowToDose(row: Record<string, unknown>): Dose {
    return {
      id: row.id as string,
      medicationId: row.medication_id as string,
      medicationName: row.medication_name as string,
      medicationUnit: row.medication_unit as string,
      medicationType: row.medication_type as string,
      scheduledDate: row.scheduled_date as string,
      scheduledTime: row.scheduled_time as string,
      status: row.status as DoseStatus,
      confirmedAt: row.confirmed_at as string | undefined,
    };
  }

  async generateForMedication(
    medication: Medication,
    date: string,
  ): Promise<Result<void>> {
    try {
      const db = await getDatabase();

      if (!isScheduledForDate(medication.weekDays, date)) return ok(undefined);

      // Evita duplicar doses caso já existam para essa data
      const existing = await db.getAllAsync<{ id: string }>(
        'SELECT id FROM doses WHERE medication_id = ? AND scheduled_date = ?',
        [medication.id, date],
      );

      if (existing.length > 0) return ok(undefined);

      // Usa o firstDose do medicamento como âncora para determinar
      // quais horários pertencem ao dia atual e quais viraram a meia-noite.
      // Horários >= firstDose pertencem ao dia `date`.
      // Horários < firstDose viraram a meia-noite e pertencem ao dia seguinte.
      const firstTime = medication.firstDose ?? medication.schedules[0];
      const now = new Date().toTimeString().slice(0, 5); // HH:MM
      const nextDate = new Date(date + 'T12:00:00');
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDateStr = nextDate.toISOString().split('T')[0];

      await db.withTransactionAsync(async () => {
        for (const time of medication.schedules) {
          const isToday = time >= firstTime;
          const targetDate = isToday ? date : nextDateStr;

          // Ignora horários do dia atual que já passaram
          if (isToday && time < now) continue;

          await db.runAsync(
            `INSERT INTO doses (id, medication_id, scheduled_date, scheduled_time, status)
             VALUES (?, ?, ?, ?, 'pending')`,
            [this.generateId(), medication.id, targetDate, time],
          );
        }
      });

      return ok(undefined);
    } catch (error) {
      return fail(error);
    }
  }

  async findByDate(date: string): Promise<Result<Dose[]>> {
    try {
      const db = await getDatabase();

      const rows = await db.getAllAsync<Record<string, unknown>>(
        `SELECT
           d.id,
           d.medication_id,
           m.name  AS medication_name,
           m.amount || ' • ' || m.unit AS medication_unit,
           m.type  AS medication_type,
           d.scheduled_date,
           d.scheduled_time,
           d.status,
           d.confirmed_at
         FROM doses d
         JOIN medications m ON m.id = d.medication_id
         WHERE d.scheduled_date = ?
         ORDER BY d.scheduled_time ASC`,
        [date],
      );

      return ok(rows.map((row) => this.rowToDose(row)));
    } catch (error) {
      return fail(error);
    }
  }

  // Retorna a próxima dose pendente do dia atual.
  // Prioriza doses futuras; se não houver, retorna a primeira pendente do dia
  // (horário já passou mas ainda não foi tomada nem pulada).
  async findNextPending(): Promise<Result<Dose | null>> {
    try {
      const db = await getDatabase();
      const today = todayAsString();
      const now = new Date().toTimeString().slice(0, 5); // HH:MM

      const baseQuery = `
        SELECT
          d.id,
          d.medication_id,
          m.name  AS medication_name,
          m.amount || ' • ' || m.unit AS medication_unit,
          m.type  AS medication_type,
          d.scheduled_date,
          d.scheduled_time,
          d.status,
          d.confirmed_at
        FROM doses d
        JOIN medications m ON m.id = d.medication_id
        WHERE d.scheduled_date = ?
          AND d.status = 'pending'
      `;

      const futureRow = await db.getFirstAsync<Record<string, unknown>>(
        baseQuery +
          ' AND d.scheduled_time >= ? ORDER BY d.scheduled_time ASC LIMIT 1',
        [today, now],
      );

      if (futureRow) return ok(this.rowToDose(futureRow));

      const pastRow = await db.getFirstAsync<Record<string, unknown>>(
        baseQuery + ' ORDER BY d.scheduled_time ASC LIMIT 1',
        [today],
      );

      if (!pastRow) return ok(null);

      return ok(this.rowToDose(pastRow));
    } catch (error) {
      return fail(error);
    }
  }

  async updateStatus(id: string, status: DoseStatus): Promise<Result<Dose>> {
    try {
      const db = await getDatabase();
      const confirmedAt =
        status === 'administered' ? new Date().toISOString() : null;

      await db.runAsync(
        'UPDATE doses SET status = ?, confirmed_at = ? WHERE id = ?',
        [status, confirmedAt, id],
      );

      const row = await db.getFirstAsync<Record<string, unknown>>(
        `SELECT
           d.id,
           d.medication_id,
           m.name  AS medication_name,
           m.amount || ' • ' || m.unit AS medication_unit,
           m.type  AS medication_type,
           d.scheduled_date,
           d.scheduled_time,
           d.status,
           d.confirmed_at
         FROM doses d
         JOIN medications m ON m.id = d.medication_id
         WHERE d.id = ?`,
        [id],
      );

      if (!row) return fail(new Error('Dose não encontrada'));

      return ok(this.rowToDose(row));
    } catch (error) {
      return fail(error);
    }
  }

  // Retorna as datas com status para o calendário do histórico
  async getMarkedDates(): Promise<
    Result<Record<string, { status: 'complete' | 'partial' | 'missed' }>>
  > {
    try {
      const db = await getDatabase();

      const rows = await db.getAllAsync<{
        scheduled_date: string;
        total: number;
        administered: number;
        missed: number;
      }>(
        `SELECT
           scheduled_date,
           COUNT(*) AS total,
           SUM(CASE WHEN status = 'administered' THEN 1 ELSE 0 END) AS administered,
           SUM(CASE WHEN status = 'missed'        THEN 1 ELSE 0 END) AS missed
         FROM doses
         WHERE status != 'pending'
         GROUP BY scheduled_date`,
      );

      const markedDates: Record<
        string,
        { status: 'complete' | 'partial' | 'missed' }
      > = {};

      for (const row of rows) {
        if (row.administered === row.total) {
          markedDates[row.scheduled_date] = { status: 'complete' };
        } else if (row.missed === row.total) {
          markedDates[row.scheduled_date] = { status: 'missed' };
        } else {
          markedDates[row.scheduled_date] = { status: 'partial' };
        }
      }

      return ok(markedDates);
    } catch (error) {
      return fail(error);
    }
  }

  async markMissedDoses(): Promise<Result<number>> {
    try {
      const db = await getDatabase();

      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toTimeString().slice(0, 5);

      const result = await db.runAsync(
        `UPDATE doses
       SET status = 'missed'
       WHERE status = 'pending'
         AND scheduled_date = ?
         AND scheduled_time < ?`,
        [today, now],
      );

      return ok(result.changes);
    } catch (error) {
      return fail(error);
    }
  }
}

export const doseRepository = new DoseRepository();
