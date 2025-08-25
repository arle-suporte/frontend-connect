'use client'

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { createContact } from "@/services/contact/create-contact";

interface CreateContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactUuid: string;
  contactName: string;
  onContactCreated: () => void
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({
  isOpen,
  onClose,
  contactUuid,
  contactName,
  onContactCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Informe o nome do contato.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await createContact(name, phone);
      if (onContactCreated) {
        onContactCreated();
      }
      onClose();
    } catch (e: any) {
      setError(e?.message || "Falha ao Cadastrar contato.");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Cadastrar Contato
          </DialogTitle>
          <DialogDescription className="text-foreground">
            Confirme e complete os dados para Cadastrar o contato
            {contactName ? (
              <>
                : <strong className="ml-1">{contactName}</strong>
              </>
            ) : (
              "."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm font-medium">
              Nome
            </label>
            <Input
              id="name"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="phone" className="text-sm font-medium">
              Número de Telefone
            </label>
            <Input
              id="phone"
              placeholder="+558143212345"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              inputMode="tel"
            />
            <div className="text-sm text-foreground">
              Só o número. Sem símbolos nem o 9 na frente. Ex: 558173412345
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar Contato"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContactModal;