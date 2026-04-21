import * as SQLite from 'expo-sqlite';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE medications (
      id            TEXT PRIMARY KEY NOT NULL,
      name          TEXT NOT NULL,
      amount        TEXT NOT NULL,
      type          TEXT NOT NULL,
      unit          TEXT NOT NULL,
      schedule_mode TEXT NOT NULL,
      interval      INTEGER,
      first_dose    TEXT,
      created_at    TEXT NOT NULL
    );

    CREATE TABLE medication_week_days (
      id            TEXT PRIMARY KEY NOT NULL,
      medication_id TEXT NOT NULL,
      week_day      INTEGER NOT NULL,
      FOREIGN KEY (medication_id) REFERENCES medications (id) ON DELETE CASCADE
    );

    CREATE TABLE medication_schedules (
      id            TEXT PRIMARY KEY NOT NULL,
      medication_id TEXT NOT NULL,
      time          TEXT NOT NULL,
      FOREIGN KEY (medication_id) REFERENCES medications (id) ON DELETE CASCADE
    );
  `);
}
