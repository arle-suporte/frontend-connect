import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";
import { fetchAllUsers, fetchAuthUsers } from "@/services/user/get-users";
import { transferService } from "@/services/service/transfer-service";


interface TransferServiceModalProps {
  open: boolean;
  onClose: () => void;
  serviceUuid: string;
  contactName: string;
  onConfirm: (targetUserUuid: string) => void;
  collaborators: string[]
}

const TransferServiceModal: React.FC<TransferServiceModalProps> = ({
  open,
  onClose,
  serviceUuid,
  contactName,
  onConfirm,
  collaborators,
}) => {
  const [users, setUsers] = useState<[]>([]);
  const [selectedUuid, setSelectedUuid] = useState<string>("");
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const list = await fetchAllUsers();
        setUsers(list.results);
      } catch (err: any) {
        setErrorUsers(err?.message || "Erro ao carregar colaboradores");
      } finally {
        setLoadingUsers(false);
      }
    };

    load();
  }, [open]);

  const handleTransfer = async () => {
    if (!selectedUuid) return;
    setLoadingSubmit(true);
    try {
      await transferService(serviceUuid, selectedUuid);
      onConfirm(selectedUuid);
      onClose();
    } catch (err: any) {
      alert(err?.message || "Erro ao transferir atendimento.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const hasOptions = users.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Transferir Atendimento
          </DialogTitle>
          <DialogDescription className="text-foreground">
            Selecione o colaborador (por email) que assumirá o atendimento de{" "}
            <strong>{contactName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Label htmlFor="target-user">Colaborador destino</Label>

          {loadingUsers ? (
            <div className="text-sm text-muted-foreground">
              Carregando colaboradores...
            </div>
          ) : errorUsers ? (
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-destructive">{errorUsers}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsers([]);
                  setSelectedUuid("");
                  setErrorUsers(null);
                  setLoadingUsers(true);
                  fetchAllUsers()
                    .then(setUsers)
                    .catch((e) => setErrorUsers(e?.message || "Erro ao carregar colaboradores"))
                    .finally(() => setLoadingUsers(false));
                }}
              >
                Tentar novamente
              </Button>
            </div>
          ) : hasOptions ? (
            <Select value={selectedUuid} onValueChange={setSelectedUuid}>
              <SelectTrigger id="target-user">
                <SelectValue placeholder="Selecione um email" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: any) => (
                  <SelectItem key={u.uuid} value={u.uuid}>
                    {u.name} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground">
              Nenhum colaborador disponível.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loadingSubmit}>
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={loadingSubmit || !selectedUuid || !hasOptions}
          >
            {loadingSubmit ? "Transferindo..." : "Transferir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferServiceModal;
