import React from 'react';
import { UserX } from "lucide-react";
import ConfirmationModal from '../ConfirmationModal';
import { inactivateContact } from '@/services/contact/inactivate-contact';


interface InactivateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDeleted: boolean;
  contactUuid: string;
  contactName: string;
  onContactInactivated?: () => void;
}

const InactivateContactModal: React.FC<InactivateContactModalProps> = ({
  isDeleted,
  isOpen,
  onClose,
  contactUuid,
  contactName,
  onContactInactivated
}) => {
  const handleInactivate = async () => {
    await inactivateContact(contactUuid);
    if (onContactInactivated) {
      onContactInactivated();
    }
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title="Inativar Contato"
      description={
        <>
          Esta ação irá inativar o contato <strong>{contactName}</strong>.
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">
            O contato não será excluído, mas ficará inativo no sistema e não aparecerá nas listagens principais. Você pode reativá-lo depois.
          </span>
        </>
      }
      confirmText="Inativar Contato"
      confirmVariant="destructive"
      icon={UserX}
      iconColor="text-destructive"
      onConfirm={handleInactivate}
      loadingText="Inativando..."
      showWarning={true}
      warningText="O contato será movido para a lista de inativos."
      maxWidth="sm:max-w-[450px]"
      disabled={!contactUuid || isDeleted}
    />
  );
};

export default InactivateContactModal;