import * as Crypto from 'expo-crypto';
import { Medication } from './medicationRepository';
import { IDoseRepository } from './doseRepositoryInterface';
import { fail, ok, Result } from '../../utils/result';
import { getDatabase } from '..';

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

      const existing = await db.getAllAsync<{ id: string }>(
        'SELECT id FROM doses WHERE medication_id = ? AND scheduled_date = ?',
        [medication.id, date],
      );

      if (existing.length > 0) return ok(undefined);

      await db.withTransactionAsync(async () => {
        for (const time of medication.schedules) {
          await db.runAsync(
            `INSERT INTO doses (id, medication_id, scheduled_date, scheduled_time, status)
             VALUES (?, ?, ?, ?, 'pending')`,
            [this.generateId(), medication.id, date, time],
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

  // Retorna a próxima dose pendente do dia atual
  async findNextPending(): Promise<Result<Dose | null>> {
    try {
      const db = await getDatabase();
      const today = todayAsString();
      const now = new Date().toTimeString().slice(0, 5);

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
         WHERE d.scheduled_date = ?
           AND d.status = 'pending'
           AND d.scheduled_time >= ?
         ORDER BY d.scheduled_time ASC
         LIMIT 1`,
        [today, now],
      );

      if (!row) return ok(null);

      return ok(this.rowToDose(row));
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
}

export const doseRepository = new DoseRepository();
