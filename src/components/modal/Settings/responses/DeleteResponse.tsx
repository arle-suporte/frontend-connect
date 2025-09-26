import React from 'react';
import ConfirmationModal from "../../ConfirmationModal";
import { Trash } from "lucide-react";
import { deleteResponse } from '@/services/setting/response/delete-response';

interface DeleteResponseModalProps {
  open: boolean;
  onClose: () => void;
  responseUuid: string;
  responseSubtitle: string;
  onSuccess: () => void;
}

export default function DeleteResponseModal({
  open,
  onClose,
  responseUuid,
  responseSubtitle,
  onSuccess,
}: DeleteResponseModalProps) {

  const handleDelete = async () => {
    try {
      await deleteResponse(responseUuid)
      console.log(`Resposta com UUID ${responseUuid} excluída.`);
      onSuccess();
    } catch (error) {
      console.error("Erro ao deletar resposta:", error);
    }
  };

  return (
    <ConfirmationModal
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Excluir Resposta"
      description={
        <>
          Tem certeza que quer excluir a resposta
          <span className="font-semibold text-foreground"> "{responseSubtitle}"</span>?
        </>
      }
      confirmText="Excluir resposta"
      confirmVariant="destructive"
      icon={Trash}
      iconColor="text-destructive"
      loadingText="Excluindo..."
      showWarning={true}
      warningText="Esta ação não pode ser desfeita e a resposta será permanentemente removida."
      maxWidth="sm:max-w-[450px]"
    />
  );
}