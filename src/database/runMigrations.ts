import * as SQLite from 'expo-sqlite';
import { up as migration1 } from './migrations/1_create_medication_tables';
import { up as migration2 } from './migrations/2_create_dose_table';
import { up as migration3 } from './migrations/3_add_recurring_medications';

// Registre aqui cada nova migration na ordem correta.
// Nunca remova ou reordene as existentes.
const MIGRATIONS = [migration1, migration2, migration3];

export async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );

  const currentVersion = result?.user_version ?? 0;
  const pendingMigrations = MIGRATIONS.slice(currentVersion);

  if (pendingMigrations.length === 0) return;

  for (const migrate of pendingMigrations) {
    await migrate(db);
  }

  const nextVersion = MIGRATIONS.length;
  await db.execAsync(`PRAGMA user_version = ${nextVersion}`);
}
