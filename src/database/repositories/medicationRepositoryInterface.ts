import { MedicationFormData } from '../../pages/AddMedication/validationSchema';
import { Result } from '../../utils/result';
import { Medication } from './medicationRepository';

export interface IMedicationRepository {
  save(data: MedicationFormData): Promise<Result<Medication>>;
  findAll(): Promise<Result<Medication[]>>;
  findById(id: string): Promise<Result<Medication | null>>;
  update(id: string, data: MedicationFormData): Promise<Result<Medication>>;
  delete(id: string): Promise<Result<void>>;
}
