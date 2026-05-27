import { createContext, useContext } from 'react';

interface InputContextValue {
  focused: boolean;
  setFocused: (value: boolean) => void;
  editable: boolean;
  error?: string;
}

export const InputContext = createContext<InputContextValue>({
  focused: false,
  setFocused: () => {},
  editable: true,
  error: undefined,
});

export const useInputContext = () => useContext(InputContext);
