"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LucideIcon } from "lucide-react";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  confirmVariant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
  icon?: LucideIcon;
  iconColor?: string;
  maxWidth?: string;
  loadingText?: string;
  showWarning?: boolean;
  warningText?: string;
  disabled?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  title,
  description,
  confirmText,
  cancelText = "Cancelar",
  onConfirm,
  confirmVariant = "default",
  icon: Icon,
  iconColor = "text-primary",
  maxWidth = "sm:max-w-[400px]",
  loadingText,
  showWarning = false,
  warningText = "Esta ação não pode ser desfeita.",
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  const getLoadingText = () => {
    if (loadingText) return loadingText;
    return confirmText
      .replace(/ar$/, "ando...")
      .replace(/er$/, "endo...")
      .replace(/ir$/, "indo...");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          {Icon ? (
            <FormLabelWithIcon
              htmlFor="confirm"
              icon={<Icon className={`h-5 w-5 ${iconColor}`} />}
              text={title}
            />
          ) : (
            <DialogTitle>{title}</DialogTitle>
          )}

          <DialogDescription className="text-foreground">
            {description}
          </DialogDescription>

          {showWarning && (
            <div className="flex items-start gap-2 p-3 bg-red-100 border border-amber-200 rounded-md text-sm text-red-800">
              <AlertTriangle className="h-4 w-4 text-red-800 mt-0.5 flex-shrink-0" />
              <span>
                Atenção! <br />
                {warningText}
              </span>
            </div>
          )}
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading || disabled}
          >
            {isLoading ? getLoadingText() : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;