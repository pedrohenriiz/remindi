import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
import { MedicationFormData } from '../../pages/AddMedication/validationSchema';
import { fail, ok, Result } from '../../utils/result';
import { getDatabase } from '..';
import { IMedicationRepository } from './medicationRepositoryInterface';

export type MedicationType = 'tablet' | 'capsule' | 'liquid' | 'other';
export type ScheduleMode = 'manual' | 'interval';

export interface Medication {
  id: string;
  name: string;
  amount: string;
  type: MedicationType;
  unit: string;
  scheduleMode: ScheduleMode;
  interval?: number;
  firstDose?: string;
  weekDays: number[];
  schedules: string[];
  createdAt: string;
}

class MedicationRepository implements IMedicationRepository {
  private generateId(): string {
    return Crypto.randomUUID();
  }

  private rowToMedication(
    row: Record<string, unknown>,
  ): Omit<Medication, 'weekDays' | 'schedules'> {
    return {
      id: row.id as string,
      name: row.name as string,
      amount: row.amount as string,
      type: row.type as MedicationType,
      unit: row.unit as string,
      scheduleMode: row.schedule_mode as ScheduleMode,
      interval: row.interval != null ? Number(row.interval) : undefined,
      firstDose: row.first_dose as string | undefined,
      createdAt: row.created_at as string,
    };
  }

  private async hydrateMedication(
    db: SQLite.SQLiteDatabase,
    base: Omit<Medication, 'weekDays' | 'schedules'>,
  ): Promise<Medication> {
    const weekDayRows = await db.getAllAsync<{ week_day: number }>(
      'SELECT week_day FROM medication_week_days WHERE medication_id = ? ORDER BY week_day ASC',
      [base.id],
    );

    const scheduleRows = await db.getAllAsync<{ time: string }>(
      'SELECT time FROM medication_schedules WHERE medication_id = ? ORDER BY time ASC',
      [base.id],
    );

    return {
      ...base,
      weekDays: weekDayRows.map((r) => r.week_day),
      schedules: scheduleRows.map((r) => r.time),
    };
  }

  private async insertWeekDays(
    db: SQLite.SQLiteDatabase,
    medicationId: string,
    weekDays: number[],
  ): Promise<void> {
    for (const day of weekDays) {
      await db.runAsync(
        'INSERT INTO medication_week_days (id, medication_id, week_day) VALUES (?, ?, ?)',
        [this.generateId(), medicationId, day],
      );
    }
  }

  private async insertSchedules(
    db: SQLite.SQLiteDatabase,
    medicationId: string,
    schedules: string[],
  ): Promise<void> {
    for (const time of schedules) {
      await db.runAsync(
        'INSERT INTO medication_schedules (id, medication_id, time) VALUES (?, ?, ?)',
        [this.generateId(), medicationId, time],
      );
    }
  }

  async save(data: MedicationFormData): Promise<Result<Medication>> {
    try {
      const db = await getDatabase();
      const id = this.generateId();
      const createdAt = new Date().toISOString();

      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `INSERT INTO medications (id, name, amount, type, unit, schedule_mode, interval, first_dose, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            data.name,
            data.amount,
            data.type,
            data.unit,
            data.scheduleMode,
            data.interval ?? null,
            data.firstDose ?? null,
            createdAt,
          ],
        );

        await this.insertWeekDays(db, id, data.weekDays);
        await this.insertSchedules(db, id, data.schedules);
      });

      const medication = await this.hydrateMedication(db, {
        id,
        name: data.name,
        amount: data.amount,
        type: data.type as MedicationType,
        unit: data.unit,
        scheduleMode: data.scheduleMode as ScheduleMode,
        interval: data.interval,
        firstDose: data.firstDose,
        createdAt,
      });

      return ok(medication);
    } catch (error) {
      return fail(error);
    }
  }

  async findAll(): Promise<Result<Medication[]>> {
    try {
      const db = await getDatabase();

      const rows = await db.getAllAsync<Record<string, unknown>>(
        'SELECT * FROM medications ORDER BY created_at DESC',
      );

      const medications = await Promise.all(
        rows.map((row) =>
          this.hydrateMedication(db, this.rowToMedication(row)),
        ),
      );

      return ok(medications);
    } catch (error) {
      return fail(error);
    }
  }

  async findById(id: string): Promise<Result<Medication | null>> {
    try {
      const db = await getDatabase();

      const row = await db.getFirstAsync<Record<string, unknown>>(
        'SELECT * FROM medications WHERE id = ?',
        [id],
      );

      if (!row) return ok(null);

      const medication = await this.hydrateMedication(
        db,
        this.rowToMedication(row),
      );
      return ok(medication);
    } catch (error) {
      return fail(error);
    }
  }

  async update(
    id: string,
    data: MedicationFormData,
  ): Promise<Result<Medication>> {
    try {
      const db = await getDatabase();

      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `UPDATE medications
           SET name = ?, amount = ?, type = ?, unit = ?, schedule_mode = ?, interval = ?, first_dose = ?
           WHERE id = ?`,
          [
            data.name,
            data.amount,
            data.type,
            data.unit,
            data.scheduleMode,
            data.interval ?? null,
            data.firstDose ?? null,
            id,
          ],
        );

        await db.runAsync(
          'DELETE FROM medication_week_days WHERE medication_id = ?',
          [id],
        );
        await db.runAsync(
          'DELETE FROM medication_schedules WHERE medication_id = ?',
          [id],
        );

        await this.insertWeekDays(db, id, data.weekDays);
        await this.insertSchedules(db, id, data.schedules);
      });

      const result = await this.findById(id);

      if (!result.success) return fail(result.error);

      return ok(result.data!);
    } catch (error) {
      return fail(error);
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      const db = await getDatabase();

      await db.runAsync('DELETE FROM medications WHERE id = ?', [id]);

      return ok(undefined);
    } catch (error) {
      return fail(error);
    }
  }
}

export const medicationRepository = new MedicationRepository();
