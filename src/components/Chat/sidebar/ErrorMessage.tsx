import React from "react";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-32 text-center p-4">
      <div className="text-sm text-destructive">
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
};