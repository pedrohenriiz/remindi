import { createContext, useContext } from 'react';
import { Animated } from 'react-native';

interface SheetContextValue {
  onClose: () => void;
  animateOut: (cb?: () => void) => void;
  backdropOpacity: Animated.Value;
  sheetTranslateY: Animated.Value;
  panResponder: any;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export const useSheetContext = () => useContext(SheetContext);
