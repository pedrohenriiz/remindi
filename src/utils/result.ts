export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

export function fail<T>(error: unknown): Result<T> {
  if (error instanceof Error) {
    return { success: false, error: error.message };
  }

  return { success: false, error: 'Erro desconhecido' };
}
