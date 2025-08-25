import React from 'react';
import { CircleOff } from "lucide-react";
import ConfirmationModal from '../ConfirmationModal';
import { dismissService } from '@/services/service/dismiss-service';

interface DismissServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceUuid: string;
  contactName: string;
}

const DismissServiceModal: React.FC<DismissServiceModalProps> = ({
  isOpen,
  onClose,
  serviceUuid,
  contactName
}) => {
  const handleDismiss = async () => {
    await dismissService(serviceUuid);
  };

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={onClose}
      title="Desconsiderar Atendimento"
      description={
        <>
          Tem certeza que deseja desconsiderar o atendimento de <strong>{contactName}</strong>?
        </>
      }
      confirmText="Desconsiderar Atendimento"
      confirmVariant="destructive"
      icon={CircleOff}
      iconColor="text-destructive"
      onConfirm={handleDismiss}
      loadingText="Desconsiderando..."
    />
  );
};

export default DismissServiceModal