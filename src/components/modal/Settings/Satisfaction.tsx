import ToggleModal from "../ToggleModal";
import { ClipboardList } from "lucide-react";

interface SatisfactionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isEnabled: boolean;
    onToggleChange: (enabled: boolean) => void;
}

export default function SatisfactionModal({
    open,
    onOpenChange,
    isEnabled,
    onToggleChange,
}: SatisfactionModalProps) {
    return (
        <ToggleModal
            open={open}
            onOpenChange={onOpenChange}
            title="Pesquisa de satisfação"
            icon={ClipboardList}
            description="Saiba como está a satisfação dos seus clientes através de uma rápida pesquisa."
            isToggleEnabled={isEnabled}
            onToggleChange={onToggleChange}
            toggleLabel="Ativar pesquisa de satisfação"
        />
    );
}