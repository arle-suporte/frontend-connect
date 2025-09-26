import React from 'react';
import ConfirmationModal from "../../ConfirmationModal";
import { Trash } from "lucide-react";
import { deleteCategory } from '@/services/setting/category/delete-category';

interface DeleteCategoryModalProps {
  open: boolean;
  onClose: () => void;
  categoryUuid: string;
  categoryTitle: string;
  onSuccess: () => void;
}

export default function DeleteCategoryModal({
  open,
  onClose,
  categoryUuid,
  categoryTitle,
  onSuccess,
}: DeleteCategoryModalProps) {

  const handleDelete = async () => {
    try {
      await deleteCategory(categoryUuid)
      console.log(`categoria com UUID ${categoryUuid} excluída.`);
      onSuccess();
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    }
  };

  return (
    <ConfirmationModal
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Excluir categoria"
      description={
        <>
          Tem certeza que quer excluir a categoria
          <span className="font-semibold text-foreground"> "{categoryTitle}"</span>?
        </>
      }
      confirmText="Excluir categoria"
      confirmVariant="destructive"
      icon={Trash}
      iconColor="text-destructive"
      loadingText="Excluindo..."
      showWarning={true}
      warningText="Esta ação não pode ser desfeita e a categoria será permanentemente removida, assim como todas as mensagens dela."
      maxWidth="sm:max-w-[450px]"
    />
  );
}