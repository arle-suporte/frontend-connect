"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Building, Save, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { editContact } from "@/services/contact/edit-contact";
import { CommonSelect } from "@/components/ui/CommonSelect";
import { getAllClients } from "@/utils/getAll";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { useZodForm } from "@/hooks/useZodForm";
import { contactSchema, ContactFormData } from "@/schemas/contact";

interface EditContactModalProps {
  open: boolean;
  onClose: () => void;
  contactData: any;
  onContactUpdated: () => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  open,
  onClose,
  contactData,
  onContactUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const { formData, setField, setFormData, errors, validate } = useZodForm(
    contactSchema,
    { uuid: "", name: "", phone: "", client: "" } as ContactFormData
  );

  useEffect(() => {
    if (open && contactData) {
      setFormData({
        uuid: contactData.uuid || "",
        name: contactData.name || "",
        phone: contactData.contact || "", // no backend é phone_number
        client: contactData.client || "",
      });
      setGlobalError("");
      setSuccess(false);
    }
  }, [open, contactData, setFormData]);

  const handleUpdate = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await editContact(
        formData.uuid!,
        formData.name,
        formData.phone,
        formData.client
      );
      onContactUpdated?.();
      setSuccess(true);
      onClose();
    } catch (error: any) {
      setGlobalError(
        error.message || "Erro ao atualizar contato. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ uuid: "", name: "", phone: "", client: "" });
      setGlobalError("");
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            Editar Contato
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {globalError && (
            <Alert variant="destructive">
              <AlertDescription>{globalError}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <AlertDescription>
                Contato atualizado com sucesso!
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <FormLabelWithIcon
                htmlFor="name"
                icon={<User className="h-4 w-4 text-primary" />}
                text="Nome"
                required
              />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setField("name", e.target.value)}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <FormLabelWithIcon
                htmlFor="phone"
                icon={<Phone className="h-4 w-4 text-green-600" />}
                text="Contato"
                required
              />
              <Input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setField("phone", e.target.value)}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
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

          <DialogFooter className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading || success}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactModal;
