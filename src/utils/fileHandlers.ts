
import { useCallback } from 'react';


export const createOpenInputHandler = (
  inputRef: any,
  isDisabled?: boolean
) => {
  return useCallback(() => {
    if (isDisabled) return;
    inputRef.current?.click();
  }, [inputRef, isDisabled]);
};

// Função genérica para upload de arquivo
export const createFileUploadHandler = (
  onSendMessage: (file: File) => void,
  isDisabled?: boolean,
  validator?: (file: File) => boolean,
  errorMessage?: string
) => {
  return useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;

    const file = e.target.files?.[0];
    if (!file) return;

    if (validator && !validator(file)) {
      if (errorMessage) alert(errorMessage);
      e.target.value = "";
      return;
    }

    onSendMessage(file);
    e.target.value = "";
  }, [onSendMessage, isDisabled, validator, errorMessage]);
};