import { StatusBottomSheet } from '../../../components/StatusBottomSheet';
import { Dose } from '../../../database/repositories/doseRepository';
import { DoseStatus } from '../../../types/doseStatusType';

interface HomeStatusBottomSheetProps {
  bottomSheet: {
    visible: boolean;
    dose: Dose;
    onSelect: (status: DoseStatus) => void;
    onClose: () => void;
  };
}

export default function HomeStatusBottomSheet({
  bottomSheet,
}: HomeStatusBottomSheetProps) {
  const { dose } = bottomSheet;

  return (
    <StatusBottomSheet.Root
      visible={bottomSheet.visible}
      onClose={bottomSheet.onClose}
    >
      <StatusBottomSheet.Backdrop />
      <StatusBottomSheet.Container>
        <StatusBottomSheet.Header
          medicationName={dose.medicationName}
          medicationUnit={dose.medicationUnit}
          scheduledTime={dose.scheduledTime}
          currentStatus={dose.status}
        />
        <StatusBottomSheet.OptionList
          currentStatus={dose.status}
          onSelect={bottomSheet.onSelect}
        />
      </StatusBottomSheet.Container>
    </StatusBottomSheet.Root>
  );
}
