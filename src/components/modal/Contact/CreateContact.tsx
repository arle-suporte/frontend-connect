"use client";

import React, { useState } from "react";
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
import { User, Phone, Building } from "lucide-react";
import { createContact } from "@/services/contact/create-contact";
import { CommonSelect } from "@/components/ui/CommonSelect";
import { getAllClients } from "@/utils/getAll";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { useZodForm } from "@/hooks/useZodForm";
import { contactSchema, ContactFormData } from "@/schemas/contact";

interface CreateContactModalProps {
  open: boolean;
  onClose: () => void;
  contactName: string;
  onContactCreated: () => void;
}

const CreateContactModal: React.FC<CreateContactModalProps> = ({
  open,
  onClose,
  contactName,
  onContactCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { formData, setField, setFormData, errors, validate } = useZodForm(
    contactSchema,
    { name: "", phone: "", client: "" } as ContactFormData
  );

  const handleCreate = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await createContact(formData.name, formData.phone, formData.client || "");
      onContactCreated?.();
      onClose();
      setFormData({ name: "", phone: "", client: "" });
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Cadastrar Contato
          </DialogTitle>
          <DialogDescription className="text-foreground">
            Confirme e complete os dados para cadastrar o contato
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
            <FormLabelWithIcon
              htmlFor="name"
              icon={<User className="h-4 w-4 text-primary" />}
              text="Nome"
              required
            />
            <Input
              id="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) => setField("name", e.target.value)}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-1">
            <FormLabelWithIcon
              htmlFor="phone"
              icon={<Phone className="h-4 w-4 text-green-600" />}
              text="Contato"
              required
            />
            <Input
              id="phone"
              placeholder="558173412345"
              value={formData.phone}
              onChange={(e) => setField("phone", e.target.value)}
              disabled={isLoading}
              inputMode="tel"
            />
            <div className="text-xs text-muted-foreground">
              Apenas números. Ex: 558173412345
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="grid gap-1">
            <FormLabelWithIcon
              htmlFor="client"
              icon={<Building className="h-4 w-4 text-indigo-600" />}
              text="Cliente"
            />
            <CommonSelect
              getAll={getAllClients}
              value={formData.client}
              onChange={(val) => setField("client", val)}
              valueField="uuid"
              labelField={["trade_name", "federal_registration"]}
              placeholder="Selecione um cliente"
              searchable
            />
            {errors.client && (
              <p className="text-sm text-destructive">{errors.client}</p>
            )}
          </div>
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
