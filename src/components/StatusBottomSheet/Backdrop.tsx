import { Animated, TouchableWithoutFeedback } from 'react-native';
import { useSheetContext } from './StatusBottomSheet.context';

export function Backdrop() {
  const context = useSheetContext();

  return (
    <TouchableWithoutFeedback onPress={context?.onClose}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.4)',
          opacity: context?.backdropOpacity,
        }}
      />
    </TouchableWithoutFeedback>
  );
}
