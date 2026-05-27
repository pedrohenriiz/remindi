import { ActiveMedicationCard } from '../../../components/ActiveMedicationCard';
import { Button } from '../../../components/Common/Button';
import { Icon, IconName } from '../../../components/Common/Icon';
import { useTheme } from '../../../theme/ThemeProvider';
import { MedicationType } from '../../../types/medicationType';

const medicationTypeIcon: Record<MedicationType, IconName> = {
  tablet: 'Pill',
  capsule: 'PillBottle',
  liquid: 'Droplet',
  other: 'AlertCircle',
};

interface ActiveCardProps {
  scheduledAt: string;
  medicationName: string;
  medicationUnit: string;
  medicationType: MedicationType;
  onTake: () => void;
  onSkip: () => void;
}

export default function ActiveCard({
  scheduledAt,
  medicationName,
  medicationUnit,
  medicationType,
  onTake,
  onSkip,
}: ActiveCardProps) {
  const { theme } = useTheme();
  const { colors } = theme;

  const scheduledTime = new Date(scheduledAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ActiveMedicationCard.Root>
      <ActiveMedicationCard.Container>
        <ActiveMedicationCard.Content>
          <ActiveMedicationCard.Header>
            <ActiveMedicationCard.HeaderChip>
              <Icon name='Clock' size={12} color={colors.primary[600]} />
              Próximo: {scheduledTime}
            </ActiveMedicationCard.HeaderChip>
          </ActiveMedicationCard.Header>

          <ActiveMedicationCard.MedicationContent>
            <ActiveMedicationCard.MedicationName>
              {medicationName}
            </ActiveMedicationCard.MedicationName>

            <ActiveMedicationCard.MedicationUnit>
              {medicationUnit}
            </ActiveMedicationCard.MedicationUnit>
          </ActiveMedicationCard.MedicationContent>
        </ActiveMedicationCard.Content>

        <ActiveMedicationCard.IconContainer>
          <Icon
            name={medicationTypeIcon[medicationType]}
            size={26}
            color={colors.primary[400]}
          />
        </ActiveMedicationCard.IconContainer>
      </ActiveMedicationCard.Container>

      <ActiveMedicationCard.ButtonContainer>
        <Button.Root
          onPress={onTake}
          size='lg'
          style={{ backgroundColor: colors.primary[600] }}
        >
          <Button.Label>Tomar agora</Button.Label>
        </Button.Root>

        <Button.Root
          variant='primary'
          style={{ backgroundColor: colors.primary[100] }}
          size='lg'
          onPress={onSkip}
        >
          <Button.Label style={{ color: colors.primary[800] }}>
            Pular
          </Button.Label>
        </Button.Root>
      </ActiveMedicationCard.ButtonContainer>
    </ActiveMedicationCard.Root>
  );
}
