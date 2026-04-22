import * as SQLite from 'expo-sqlite';
import { runMigrations } from './runMigrations';

const DATABASE_NAME = process.env.EXPO_PUBLIC_DATABASE_NAME!;
const RESET_DB = process.env.EXPO_PUBLIC_RESET_DB === 'true';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');

  if (RESET_DB) {
    await db.withTransactionAsync(async () => {
      await db!.execAsync(`
        DROP TABLE IF EXISTS doses;
        DROP TABLE IF EXISTS medication_schedules;
        DROP TABLE IF EXISTS medication_week_days;
        DROP TABLE IF EXISTS medications;
      `);
    });
    await db.execAsync('PRAGMA user_version = 0');
    console.log('[DEV] Banco resetado via EXPO_PUBLIC_RESET_DB=true');
  }

  await runMigrations(db);

  return db;
}
