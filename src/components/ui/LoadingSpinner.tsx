import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  text 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center justify-center h-32">
      <div className="flex items-center gap-2">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    </div>
  );
};