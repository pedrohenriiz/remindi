import { IconName } from '../components/Common/Icon';
import { MedicationType } from '../types/medicationType';

const MEDICATION_TYPE_ICON: Record<MedicationType, IconName> = {
  tablet: 'Pill',
  capsule: 'PillBottle',
  liquid: 'Droplet',
  other: 'AlertCircle',
};

export const getMedicationTypeIcon = (type: MedicationType): IconName => {
  return MEDICATION_TYPE_ICON[type];
};
