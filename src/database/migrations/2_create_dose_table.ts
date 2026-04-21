import * as SQLite from 'expo-sqlite';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE doses (
      id             TEXT PRIMARY KEY NOT NULL,
      medication_id  TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      scheduled_time TEXT NOT NULL,
      status         TEXT NOT NULL DEFAULT 'pending',
      confirmed_at   TEXT,
      FOREIGN KEY (medication_id) REFERENCES medications (id) ON DELETE CASCADE
    );

    CREATE INDEX idx_doses_medication_id ON doses (medication_id);
    CREATE INDEX idx_doses_scheduled_date ON doses (scheduled_date);
  `);
}
