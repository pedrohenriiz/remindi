import React from 'react';
import { Modal } from 'react-native';
import { useSheetAnimation } from './hooks/useSheetAnimation';
import { SheetContext } from './StatusBottomSheet.context';

interface RootProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Root({ visible, children, onClose }: RootProps) {
  const { animateOut, panResponder, sheetTranslateY, backdropOpacity } =
    useSheetAnimation(visible);

  return (
    <Modal
      visible={visible}
      transparent
      animationType='none'
      onRequestClose={onClose}
    >
      <SheetContext.Provider
        value={{
          onClose,
          animateOut,
          sheetTranslateY,
          backdropOpacity,
          panResponder,
        }}
      >
        {children}
      </SheetContext.Provider>
    </Modal>
  );
}
