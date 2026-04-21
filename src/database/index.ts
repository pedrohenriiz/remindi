import * as SQLite from 'expo-sqlite';
import { runMigrations } from './runMigrations';

const DATABASE_NAME = process.env.EXPO_PUBLIC_DATABASE_NAME!;

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await runMigrations(db);

  return db;
}
