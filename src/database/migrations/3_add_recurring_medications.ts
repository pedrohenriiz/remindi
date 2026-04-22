import * as SQLite from 'expo-sqlite';

export async function up(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    ALTER TABLE medications ADD COLUMN recurring INTEGER NOT NULL DEFAULT 0;
  `);
}
