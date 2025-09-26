import ToggleModal from "../ToggleModal";
import { UserLock } from "lucide-react";

interface UserIdentifierModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEnabled: boolean;
    onToggleChange: (enabled: boolean) => void;
}

export default function UserIdentifierModal({
    open,
    onOpenChange,
    isEnabled,
    onToggleChange,
}: UserIdentifierModalProps) {
    return (
        <ToggleModal
            open={open}
            onOpenChange={onOpenChange}
            icon={UserLock}
            title="Identificação do usuário"
            description="Aqui você pode configurar se as mensagens dos colaboradores serão assinadas ou não."
            isToggleEnabled={isEnabled}
            onToggleChange={onToggleChange}
            toggleLabel="Ativar identificação do usuário"
        />
    );
}