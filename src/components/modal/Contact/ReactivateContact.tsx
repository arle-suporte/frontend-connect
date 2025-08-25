import React from 'react';
import { UserX } from "lucide-react";
import ConfirmationModal from '../ConfirmationModal';
import { reactivateContact } from '@/services/contact/reactivate-contact';

interface ReactivateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDeleted: boolean;
  contactUuid: string;
  contactName: string;
  onContactReactivated?: () => void;
}

const ReactivateContactModal: React.FC<ReactivateContactModalProps> = ({
  isDeleted,
  isOpen,
  onClose,
  contactUuid,
  contactName,
  onContactReactivated
}) => {
  const handleReactivate = async () => {
    await reactivateContact(contactUuid);
    if (onContactReactivated) {
      onContactReactivated();
    }
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title="Reativar Contato"
      description={
        <>
          Esta ação irá reativar o contato <strong>{contactName}</strong>.
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">
            O contato será retornado às principais listas, tendo sido restaurado com sucesso.
          </span>
        </>
      }
      confirmText="Reativar Contato"
      confirmVariant="default"
      icon={UserX}
      iconColor="text-primary"
      onConfirm={handleReactivate}
      loadingText="Reativando..."
      maxWidth="sm:max-w-[450px]"
      disabled={!contactUuid}
    />
  );
};

export default ReactivateContactModal;