import { createContext, useContext } from 'react';
import { MedicationType } from '../../types/medicationType';
import { DoseStatus } from '../../types/doseStatusType';

interface MedicationCardContextValue {
  medicationType: MedicationType;
  doseStatus: DoseStatus;
  iconBg: string;
  iconColor: string;
  background: string;
  textColor: string;
}

export const MedicationCardContext = createContext<MedicationCardContextValue>({
  background: '',
  doseStatus: 'pending',
  iconBg: '',
  iconColor: '',
  medicationType: 'capsule',
  textColor: '',
});

export const useMedicationCardContext = () => useContext(MedicationCardContext);
