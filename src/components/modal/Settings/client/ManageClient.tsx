"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  User,
  Phone,
  Mail,
  IdCard,
  Loader2,
  Save,
  Info,
} from "lucide-react";

import { clientSchema, ClientFormData } from "@/schemas/client";
import { useZodForm } from "@/hooks/useZodForm";
import { editClient } from "@/services/client/edit-client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ManageClientModalProps {
  open: boolean;
  onClose: () => void;
  clientData: any;
  onClientUpdated: () => void;
}

const ManageClientModal: React.FC<ManageClientModalProps> = ({
  open,
  onClose,
  clientData,
  onClientUpdated,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { formData, setField, setFormData, errors, validate } = useZodForm(
    clientSchema,
    {} as ClientFormData
  );

  useEffect(() => {
    if (open && clientData) {
      setFormData({
        federal_registration: clientData.federal_registration || "",
        company_name: clientData.company_name || "",
        trade_name: clientData.trade_name || "",
        description: clientData.description || "",
        status: clientData.status || "undefined",
        company_type: clientData.company_type || "undefined",
        contact_name: clientData.contact_name || "",
        contact_email: clientData.contact_email || "",
        contact_phone: clientData.contact_phone || "",
        social_responsible: clientData.social_responsible || "",
        // status_help_text: clientData.status_help_text || "",
      });
    }
  }, [open, clientData, setFormData]);

  if (!clientData) return null;

  const handleUpdate = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await editClient(
        clientData.uuid,
        formData.federal_registration,
        formData.company_name,
        formData.trade_name || '',
        formData.description || '',
        formData.status,
        formData.company_type,
        formData.contact_name,
        formData.contact_email,
        formData.contact_phone || '',
        formData.social_responsible || '',
        // formData.status_help_text
      );
      onClientUpdated?.();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            Editar Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* --- Dados da Empresa --- */}
          <section className="grid gap-4">
            <h3 className="font-semibold border-b pb-1 text-sm text-muted-foreground">
              Dados da Empresa
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabelWithIcon
                  htmlFor="federal_registration"
                  icon={<IdCard className="h-4 w-4 text-primary" />}
                  text="CNPJ"
                  required
                />
                <Input
                  id="federal_registration"
                  placeholder="00.000.000/0000-00"
                  value={formData.federal_registration}
                  onChange={(e) =>
                    setField("federal_registration", e.target.value)
                  }
                  disabled={isLoading}
                />
                {errors.federal_registration && (
                  <p className="text-sm text-destructive">
                    {errors.federal_registration}
                  </p>
                )}
              </div>

              <div>
                <FormLabelWithIcon
                  htmlFor="company_type"
                  icon={<Building2 className="h-4 w-4 text-indigo-600" />}
                  text="Tipo de Empresa"
                  required
                />
                <Select
                  value={formData.company_type}
                  onValueChange={(v) => setField("company_type", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undefined">Indefinido</SelectItem>
                    <SelectItem value="head_office">Matriz</SelectItem>
                    <SelectItem value="branch_office">Filial</SelectItem>
                  </SelectContent>
                </Select>
                {errors.company_type && (
                  <p className="text-sm text-destructive">
                    {errors.company_type}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabelWithIcon
                  htmlFor="company_name"
                  icon={<Building2 className="h-4 w-4 text-primary" />}
                  text="Razão Social"
                  required
                />
                <Input
                  id="company_name"
                  placeholder="Digite a razão social"
                  value={formData.company_name}
                  onChange={(e) => setField("company_name", e.target.value)}
                  disabled={isLoading}
                />
                {errors.company_name && (
                  <p className="text-sm text-destructive">
                    {errors.company_name}
                  </p>
                )}
              </div>

              <div>
                <FormLabelWithIcon
                  htmlFor="trade_name"
                  icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                  text="Nome Fantasia"
                />
                <Input
                  id="trade_name"
                  placeholder="Digite o nome fantasia"
                  value={formData.trade_name}
                  onChange={(e) => setField("trade_name", e.target.value)}
                  disabled={isLoading}
                />
                {errors.trade_name && (
                  <p className="text-sm text-destructive">
                    {errors.trade_name}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            <h3 className="font-semibold border-b pb-1 text-sm text-muted-foreground">
              Situação cadastral
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabelWithIcon
                  htmlFor="status"
                  icon={<Building2 className="h-4 w-4 text-indigo-600" />}
                  text="Status"
                  required
                />
                <Select
                  value={formData.status}
                  onValueChange={(v) => setField("status", v)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undefined">Indefinido</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="former_client">Ex-Cliente</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status}</p>
                )}
              </div>
              <div>
                <FormLabelWithIcon
                  htmlFor="description"
                  icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                  text="Descrição"
                />
                <Textarea
                  id="description"
                  placeholder="Descrição do cliente"
                  value={formData.description}
                  onChange={(e) => setField("description", e.target.value)}
                  disabled={isLoading}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* --- Responsável Social --- */}
          <section>
            <FormLabelWithIcon
              htmlFor="social_responsible"
              icon={<User className="h-4 w-4 text-primary" />}
              text="Responsável Social"
            />
            <Input
              id="social_responsible"
              placeholder="Nome do responsável social"
              value={formData.social_responsible}
              onChange={(e) => setField("social_responsible", e.target.value)}
              disabled={isLoading}
            />
          </section>

          <section className="grid gap-4">
            <h3 className="font-semibold border-b pb-1 text-sm text-muted-foreground">
              Dados de Contato
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <FormLabelWithIcon
                  htmlFor="contact_name"
                  icon={<User className="h-4 w-4 text-primary" />}
                  text="Nome do Contato"
                  required
                />
                <Input
                  id="contact_name"
                  placeholder="Nome completo"
                  value={formData.contact_name}
                  onChange={(e) => setField("contact_name", e.target.value)}
                  disabled={isLoading}
                />
                {errors.contact_name && (
                  <p className="text-sm text-destructive">
                    {errors.contact_name}
                  </p>
                )}
              </div>

              <div>
                <FormLabelWithIcon
                  htmlFor="contact_email"
                  icon={<Mail className="h-4 w-4 text-blue-600" />}
                  text="E-mail"
                />
                <Input
                  id="contact_email"
                  type="email"
                  placeholder="contato@exemplo.com"
                  value={formData.contact_email}
                  onChange={(e) => setField("contact_email", e.target.value)}
                  disabled={isLoading}
                />
                {errors.contact_email && (
                  <p className="text-sm text-destructive">
                    {errors.contact_email}
                  </p>
                )}
              </div>

              <div>
                <FormLabelWithIcon
                  htmlFor="contact_phone"
                  icon={<Phone className="h-4 w-4 text-green-600" />}
                  text="Telefone"
                />
                <Input
                  id="contact_phone"
                  placeholder="(11) 99999-9999"
                  value={formData.contact_phone}
                  onChange={(e) => setField("contact_phone", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </section>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageClientModal;
