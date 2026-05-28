import { Icon, IconName } from '../../../components/Common/Icon';
import { MedicationCard } from '../../../components/MedicationCard';
import { StatusBadge } from '../../../components/StatusBadge';
import { DoseStatus } from '../../../types/doseStatusType';
import { MedicationType } from '../../../types/medicationType';
import { getMedicationTypeIcon } from '../../../utils/medicationUtilts';

interface HistoryMedicationCardProps {
  medicationType: MedicationType;
  doseStatus: DoseStatus;
  medicationName: string;
  medicationUnit: string;
  confirmedAt?: string;
  scheduleAt: string;
}

export default function HistoryMedicationCard({
  medicationType,
  doseStatus,
  medicationName,
  medicationUnit,
  confirmedAt,
  scheduleAt,
}: HistoryMedicationCardProps) {
  const confirmedTime = confirmedAt
    ? new Date(confirmedAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const scheduledTime = new Date(scheduleAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const iconName = getMedicationTypeIcon(medicationType);

  return (
    <MedicationCard.Root
      medicationType={medicationType}
      doseStatus={doseStatus}
      disabled
    >
      <MedicationCard.IconContainer>
        <Icon name={iconName} />
      </MedicationCard.IconContainer>

      <MedicationCard.Content>
        <MedicationCard.MedicationName>
          {medicationName}
        </MedicationCard.MedicationName>

        <MedicationCard.MedicationUnit>
          {medicationUnit} • {scheduledTime}
        </MedicationCard.MedicationUnit>
      </MedicationCard.Content>

      <MedicationCard.BadgeContainer>
        <StatusBadge
          status={doseStatus}
          containerStyle={{ alignSelf: 'flex-end' }}
        />

        {confirmedTime && (
          <MedicationCard.ConfirmedTime>
            Marcado às {confirmedTime}
          </MedicationCard.ConfirmedTime>
        )}
      </MedicationCard.BadgeContainer>
    </MedicationCard.Root>
  );
}
