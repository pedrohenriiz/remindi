import { createContext, useContext } from 'react';
import { Animated } from 'react-native';

interface SheetContextValue {
  onClose: () => void;
  animateOut: (cb?: () => void) => void;
  backdropOpacity?: Animated.Value;
  sheetTranslateY?: Animated.Value;
  panResponder?: any;
}

export const SheetContext = createContext<SheetContextValue | null>(null);

export function useSheetContext() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('Must be used within StatusBottomSheet');
  return ctx;
}
