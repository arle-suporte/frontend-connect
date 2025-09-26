"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import ConfirmationModal from "../modal/ConfirmationModal";

interface ToggleEntityStatusModalProps {
  open: boolean;
  onClose: () => void;
  uuid: string;
  name: string;
  isDeleted: boolean;
  entityLabel: string;
  onConfirm: (uuid: string) => Promise<void>;
  onFinished?: () => void;
  mode: "inactivate" | "reactivate";
  icon?: LucideIcon;
}

const ToggleEntityStatusModal: React.FC<ToggleEntityStatusModalProps> = ({
  open,
  onClose,
  uuid,
  name,
  isDeleted,
  entityLabel,
  onConfirm,
  onFinished,
  mode,
  icon: Icon,
}) => {
  const isInactivate = mode === "inactivate";

  const handleConfirm = async () => {
    await onConfirm(uuid);
    onFinished?.();
  };

  return (
    <ConfirmationModal
      open={open}
      onClose={onClose}
      title={`${isInactivate ? "Inativar" : "Reativar"} ${entityLabel}`}
      description={
        <>
          {isInactivate ? (
            <>
              Esta ação irá inativar o {entityLabel.toLowerCase()}{" "}
              <strong>{name}</strong>.
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                O {entityLabel.toLowerCase()} não será excluído, apenas ficará
                inativo no sistema.
              </span>
            </>
          ) : (
            <>
              Esta ação irá reativar o {entityLabel.toLowerCase()}{" "}
              <strong>{name}</strong>.
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                O {entityLabel.toLowerCase()} voltará a ficar ativo e disponível
                para uso.
              </span>
            </>
          )}
        </>
      }
      confirmText={`${isInactivate ? "Inativar" : "Reativar"} ${entityLabel}`}
      confirmVariant={isInactivate ? "destructive" : "default"}
      icon={Icon}
      iconColor={isInactivate ? "text-destructive" : "text-primary"}
      onConfirm={handleConfirm}
      loadingText={isInactivate ? "Inativando..." : "Reativando..."}
      showWarning={isInactivate}
      warningText={
        isInactivate
          ? `O ${entityLabel.toLowerCase()} será movido para a lista de inativos.`
          : undefined
      }
      maxWidth="sm:max-w-[450px]"
      disabled={!uuid || (isInactivate && isDeleted)}
    />
  );
};

export default ToggleEntityStatusModal;
