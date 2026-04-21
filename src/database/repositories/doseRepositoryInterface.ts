import { Result } from '../../utils/result';
import { Dose, DoseStatus } from './doseRepository';
import { Medication } from './medicationRepository';

export interface IDoseRepository {
  generateForMedication(
    medication: Medication,
    date: string,
  ): Promise<Result<void>>;
  findByDate(date: string): Promise<Result<Dose[]>>;
  findNextPending(): Promise<Result<Dose | null>>;
  updateStatus(id: string, status: DoseStatus): Promise<Result<Dose>>;
  getMarkedDates(): Promise<
    Result<Record<string, { status: 'complete' | 'partial' | 'missed' }>>
  >;
}
