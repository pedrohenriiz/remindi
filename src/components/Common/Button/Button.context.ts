import { createContext, useContext } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonContextValue {
  variant: ButtonVariant;
  size: ButtonSize;
  loading: boolean;
  disabled: boolean;
}

export const ButtonContext = createContext<ButtonContextValue>({
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
});

export const useButtonContext = () => useContext(ButtonContext);
