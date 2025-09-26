import React from "react";

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-32 text-center p-4">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};