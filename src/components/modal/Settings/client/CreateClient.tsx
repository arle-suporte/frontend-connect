"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  User,
  Phone,
  Mail,
  IdCard,
  ClipboardCheck,
  Loader2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

import { clientSchema, ClientFormData } from "@/schemas/client";
import { useZodForm } from "@/hooks/useZodForm";
import { createClient } from "@/services/client/create-client";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { getStatus } from "@/utils/statusMap";
import { getCompanyType } from "@/utils/status";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientCreated: () => void;
}

const steps = [
  "Dados da Empresa",
  "Situação Cadastral",
  "Responsável Social",
  "Contato",
  "Revisão",
];

const CreateClientModal: React.FC<CreateClientModalProps> = ({
  open,
  onClose,
  onClientCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { formData, setField, errors, validate, setFormData } = useZodForm(
    clientSchema,
    {
      federal_registration: "",
      company_name: "",
      trade_name: "",
      description: "",
      status: "undefined",
      company_type: "undefined",
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      social_responsible: "",
    } as ClientFormData
  );

  const handleNext = () => {
    let fieldsToValidate: (keyof ClientFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = [
          "federal_registration",
          "company_name",
          "company_type",
        ];
        break;
      case 2:
        fieldsToValidate = ["status"];
        break;
      case 4:
        fieldsToValidate = ["contact_name", "contact_email", "contact_phone"];
        break;
      default:
        fieldsToValidate = [];
    }

    const isValid = validate(fieldsToValidate);
    if (!isValid) return;

    setStep((s) => Math.min(s + 1, steps.length));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleCreate = async () => {
    const isValid = validate(); // valida tudo
    if (!isValid) return;

    setIsLoading(true);
    try {
      await createClient(
        formData.federal_registration,
        formData.company_name,
        formData.trade_name || '',
        formData.description || '',
        formData.status,
        formData.company_type,
        formData.contact_name,
        formData.contact_email,
        formData.contact_phone || '',
        formData.social_responsible || ''
      );
      onClientCreated?.();
      onClose();
      setFormData({
        federal_registration: "",
        company_name: "",
        trade_name: "",
        description: "",
        status: "undefined",
        company_type: "undefined",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        social_responsible: "",
      });
      setStep(1);
    } catch (e: any) {
      console.error("Erro ao cadastrar cliente:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const progressValue = (step / steps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-3">
          <DialogTitle className="text-xl font-semibold">
            {steps[step - 1]}
          </DialogTitle>
        </DialogHeader>

        <Progress value={progressValue} className="w-full mb-4" />

        <div className="flex-1 overflow-y-auto px-1">
          {/* Steps */}
          <div className="space-y-8 py-4">
            {/* Step 1 - Dados da Empresa */}
            {step === 1 && (
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabelWithIcon
                      htmlFor="federal_registration"
                      icon={<IdCard className="h-4 w-4 text-primary" />}
                      text="CNPJ"
                      required
                    />
                    <Input
                      id="federal_registration"
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
                      htmlFor="company_name"
                      icon={<Building2 className="h-4 w-4 text-primary" />}
                      text="Razão Social"
                      required
                    />
                    <Input
                      id="company_name"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabelWithIcon
                      htmlFor="trade_name"
                      icon={
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      }
                      text="Nome Fantasia"
                    />
                    <Input
                      id="trade_name"
                      value={formData.trade_name}
                      onChange={(e) => setField("trade_name", e.target.value)}
                      disabled={isLoading}
                    />
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
              </div>
            )}

            {/* Step 2 - Situação Cadastral */}
            {step === 2 && (
              <div className="grid gap-4">
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
                      <SelectItem value="former_client">Ex-cliente</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-destructive">{errors.status}</p>
                  )}
                </div>

                <div>
                  <FormLabelWithIcon
                    htmlFor="description"
                    icon={
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    }
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
                </div>
              </div>
            )}

            {/* Step 3 - Responsável Social */}
            {step === 3 && (
              <div>
                <FormLabelWithIcon
                  htmlFor="social_responsible"
                  icon={<User className="h-4 w-4 text-primary" />}
                  text="Responsável Social (opcional)"
                />
                <Input
                  id="social_responsible"
                  value={formData.social_responsible}
                  onChange={(e) =>
                    setField("social_responsible", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Step 4 - Contato */}
            {step === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <FormLabelWithIcon
                    htmlFor="contact_name"
                    icon={<User className="h-4 w-4 text-primary" />}
                    text="Nome do Contato"
                    required
                  />
                  <Input
                    id="contact_name"
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
                    value={formData.contact_phone}
                    onChange={(e) => setField("contact_phone", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.contact_phone && (
                    <p className="text-sm text-destructive">
                      {errors.contact_phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                {[
                  {
                    title: "Dados da Empresa",
                    items: [
                      {
                        icon: <IdCard className="h-4 w-4 text-primary" />,
                        label: "CNPJ",
                        value: formData.federal_registration,
                      },
                      {
                        icon: <Building2 className="h-4 w-4 text-primary" />,
                        label: "Razão Social",
                        value: formData.company_name,
                      },
                      {
                        icon: (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        ),
                        label: "Nome Fantasia",
                        value: formData.trade_name || "-",
                      },
                      {
                        icon: <Building2 className="h-4 w-4 text-indigo-600" />,
                        label: "Tipo",
                        value: getCompanyType(formData.company_type),
                      },
                    ],
                  },
                  {
                    title: "Situação Cadastral",
                    items: [
                      {
                        icon: (
                          <ClipboardCheck className="h-4 w-4 text-indigo-600" />
                        ),
                        label: "Status",
                        value: getStatus(formData.status),
                      },
                      {
                        icon: (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        ),
                        label: "Descrição",
                        value: formData.description || "-",
                      },
                    ],
                  },
                  {
                    title: "Responsável Social",
                    items: [
                      {
                        icon: <User className="h-4 w-4 text-primary" />,
                        label: "Nome",
                        value: formData.social_responsible || "-",
                      },
                    ],
                  },
                  {
                    title: "Contato",
                    items: [
                      {
                        icon: <User className="h-4 w-4 text-primary" />,
                        label: "Nome",
                        value: formData.contact_name,
                      },
                      {
                        icon: <Mail className="h-4 w-4 text-blue-600" />,
                        label: "E-mail",
                        value: formData.contact_email || "-",
                      },
                      {
                        icon: <Phone className="h-4 w-4 text-green-600" />,
                        label: "Telefone",
                        value: formData.contact_phone || "-",
                      },
                    ],
                  },
                ].map((section, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {section.title}
                    </h4>
                    <div className="divide-y divide-muted-foreground/10">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 py-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              {item.label}
                            </p>
                            <p className="text-sm font-semibold text-foreground mt-1 break-words">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex-shrink-0 border-t pt-3 mt-2 flex justify-end">
          {step > 1 && (
            <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
              Voltar
            </Button>
          )}
          {step < steps.length ? (
            <Button onClick={handleNext} disabled={isLoading}>
              Próximo
            </Button>
          ) : (
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientModal;
