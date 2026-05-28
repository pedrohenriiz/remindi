import { Icon } from '../../../components/Common/Icon';
import { MedicationCard } from '../../../components/MedicationCard';
import { StatusBadge } from '../../../components/StatusBadge';
import { DoseStatus } from '../../../types/doseStatusType';
import { MedicationType } from '../../../types/medicationType';
import { getMedicationTypeIcon } from '../../../utils/medicationUtilts';

interface HomeMedicationCardProps {
  medicationType: MedicationType;
  doseStatus: DoseStatus;
  medicationName: string;
  medicationUnit: string;
  confirmedAt?: string;
  scheduleAt: string;
  onLongPress: () => void;
}

export default function HomeMedicationCard({
  medicationType,
  doseStatus,
  medicationName,
  medicationUnit,
  confirmedAt,
  scheduleAt,
  onLongPress,
}: HomeMedicationCardProps) {
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
      onLongPress={onLongPress}
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
