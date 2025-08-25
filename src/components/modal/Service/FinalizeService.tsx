import React from 'react';
import { CheckCircle2 } from "lucide-react";
import ConfirmationModal from '../ConfirmationModal';
import { finalizeService } from '@/services/service/finalize-service';

interface FinalizeServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceUuid: string;
  contactName: string;
}

const FinalizeServiceModal: React.FC<FinalizeServiceModalProps> = ({
  isOpen,
  onClose,
  serviceUuid,
  contactName
}) => {
  const handleFinalize = async () => {
    await finalizeService(serviceUuid);
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title="Finalizar Atendimento"
      description={
        <>
          Tem certeza que deseja finalizar o atendimento de <strong>{contactName}</strong>?
        </>
      }
      confirmText="Finalizar Atendimento"
      confirmVariant="default"
      icon={CheckCircle2}
      iconColor="text-primary"
      onConfirm={handleFinalize}
      loadingText="Finalizando..."
    />
  );
};

export default FinalizeServiceModal