import { useNavigation } from '@react-navigation/native';
import { useToast } from '../../../providers/ToastProvider';
import { SaveMedicationResultProps } from './useSaveMedication';
import { Alert } from 'react-native';

export function usePostSaveNavigation() {
  const navigation = useNavigation();
  const { show: showToast } = useToast();

  function goBackWithSuccess(medicationName: string) {
    navigation.goBack();
    showToast({
      message: `${medicationName} adicionado com sucesso!`,
      type: 'success',
    });
  }

  function handlePostSave(
    medicationName: string,
    result: SaveMedicationResultProps,
  ) {
    if (!result.ok) return;

    if (result.allTimesPassedToday) {
      Alert.alert(
        'Medicamento salvo',
        'Todos os horários de hoje já passaram. As doses começarão na próxima data configurada.',
        [{ text: 'OK', onPress: () => goBackWithSuccess(medicationName) }],
      );
      return;
    }

    goBackWithSuccess(medicationName);
  }

  return { handlePostSave };
}
