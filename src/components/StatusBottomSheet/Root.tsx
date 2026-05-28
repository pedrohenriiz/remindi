import React, { createContext, useContext } from 'react';
import { Modal } from 'react-native';
import { useSheetAnimation } from './hooks/useSheetAnimation';

interface SheetContextValue {
  onClose: () => void;
  animateOut: (cb?: () => void) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function useSheetContext() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('Must be used within StatusBottomSheet');
  return ctx;
}

interface RootProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Root({ visible, children, onClose }: RootProps) {
  const { animateOut } = useSheetAnimation(visible);

  return (
    <SheetContext.Provider value={{ onClose, animateOut }}>
      <Modal
        visible={visible}
        transparent
        animationType='none'
        onRequestClose={onClose}
      >
        {children}
      </Modal>
    </SheetContext.Provider>
  );
}
