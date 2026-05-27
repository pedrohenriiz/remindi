import * as SQLite from 'expo-sqlite';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE UNIQUE INDEX idx_unique_dose ON doses (medication_id, scheduled_date, scheduled_time);
  `);
}
