"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  Calendar,
  Briefcase,
  User,
  ImageIcon,
  ClipboardCheck,
  Loader2,
  X,
  Phone,
} from "lucide-react";

import { userSchema, UserFormData } from "@/schemas/user";
import { useZodForm } from "@/hooks/useZodForm";
import { createUser } from "@/services/user/create-user";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import {
  getRole,
  getStatusCustomerKeys,
  getStatusCustomerLabelByValue,
} from "@/utils/status";
import { getAllCustomers, getAllPositions } from "@/utils/getAll";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const steps = [
  "Dados Pessoais",
  "Credenciais e Cargo",
  "Status e Permissões",
  "Revisão",
];

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  open,
  onClose,
  onUserCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [positions, setPositions] = useState<{ uuid: string; name: string }[]>(
    []
  );
  const [users, setUsers] = useState<
    { uuid: string; name: string; email: string }[]
  >([]);

  const { formData, setField, errors, validate, setFormData } = useZodForm(
    userSchema,
    {
      name: "",
      email: "",
      avatar: "",
      current_avatar: "",
      extension_number: "",
      birthday: "",
      role: "member",
      status: "active",
      position: null,
      immediate_superior: null,
      permissions: [],
    } as UserFormData
  );

  useEffect(() => {
    (async () => {
      setPositions(await getAllPositions());
      setUsers(await getAllCustomers());
    })();
  }, []);

  const handleNext = () => {
    let fieldsToValidate: (keyof UserFormData)[] = [];
    if (step === 1) fieldsToValidate = ["name", "email", "birthday"];
    if (step === 2) fieldsToValidate = ["role", "position"];
    if (step === 3) fieldsToValidate = ["status"];
    if (!validate(fieldsToValidate)) return;
    setStep((s) => Math.min(s + 1, steps.length));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleCreate = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await createUser(formData);
      onUserCreated();
      onClose();
      setFormData({
        name: "",
        email: "",
        avatar: null,
        extension_number: "",
        birthday: "",
        role: "member",
        status: "active",
        position: null,
        immediate_superior: null,
        permissions: [],
      });
      setStep(1);
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
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
          <div className="space-y-8 py-4">
            {/* Step 1 - Dados Pessoais */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border shadow">
                      {formData.avatar instanceof File ? (
                        <AvatarImage
                          src={URL.createObjectURL(formData.avatar) || "?"}
                          alt="Preview"
                        />
                      ) : formData.current_avatar ? (
                        <AvatarImage
                          src={formData.current_avatar || "?"}
                          alt="Avatar atual"
                        />
                      ) : (
                        <AvatarFallback>
                          <User className="h-8 w-8 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {/* Botão remover (apenas se tiver algo) */}
                    {(formData.avatar || formData.current_avatar) && (
                      <button
                        type="button"
                        onClick={() => {
                          setField("avatar", null); // remove novo upload
                          setField("current_avatar", ""); // remove avatar atual
                        }}
                        className="absolute -top-2 -right-2 bg-destructive/80 text-white rounded-full p-1 shadow hover:bg-destructive transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}

                    {/* Overlay para trocar */}
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <span className="text-xs text-white font-medium">
                        {formData.avatar || formData.current_avatar
                          ? "Trocar"
                          : "Adicionar"}
                      </span>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setField("avatar", file);
                      }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {formData.avatar || formData.current_avatar
                      ? "Clique na foto para trocar ou remova"
                      : "Adicione uma foto de perfil"}
                  </p>
                </div>

                <div>
                  <FormLabelWithIcon
                    htmlFor="name"
                    icon={<User className="h-4 w-4 text-primary" />}
                    text="Nome"
                    required
                  />
                  <Input
                    value={formData.name}
                    onChange={(e) => setField("name", e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabelWithIcon
                      htmlFor="email"
                      icon={<Mail className="h-4 w-4 text-blue-600" />}
                      text="E-mail"
                      required
                    />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setField("email", e.target.value)}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <FormLabelWithIcon
                      htmlFor="birthday"
                      icon={<Calendar className="h-4 w-4 text-indigo-600" />}
                      text="Data de Nascimento"
                    />
                    <Input
                      type="date"
                      value={formData.birthday || ""}
                      onChange={(e) => setField("birthday", e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 - Credenciais e Cargo */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabelWithIcon
                    htmlFor="role"
                    icon={<Briefcase className="h-4 w-4 text-primary" />}
                    text="Cargo"
                    required
                  />
                  <Select
                    value={formData.role}
                    onValueChange={(v) => setField("role", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Proprietário</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="member">Membro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FormLabelWithIcon
                    htmlFor="position"
                    icon={<Briefcase className="h-4 w-4 text-indigo-600" />}
                    text="Ocupação"
                    required
                  />
                  <Select
                    value={formData.position?.uuid || ""}
                    onValueChange={(uuid) =>
                      setField("position", {
                        uuid,
                        name:
                          positions.find((p) => p.uuid === uuid)?.name || "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((p) => (
                        <SelectItem key={p.uuid} value={p.uuid}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FormLabelWithIcon
                    htmlFor="immediate_superior"
                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                    text="Superior Imediato"
                  />
                  <Select
                    value={formData.immediate_superior?.uuid || ""}
                    onValueChange={(uuid) =>
                      setField("immediate_superior", {
                        uuid,
                        name: users.find((u) => u.uuid === uuid)?.name || "",
                        email: users.find((u) => u.uuid === uuid)?.email || "",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.uuid} value={u.uuid}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <FormLabelWithIcon
                    htmlFor="extension_number"
                    icon={<User className="h-4 w-4 text-primary" />}
                    text="Ramal"
                  />
                  <Input
                    value={formData.extension_number || ""}
                    onChange={(e) =>
                      setField("extension_number", e.target.value)
                    }
                    disabled={isLoading}
                  />
                  {errors.extension_number && (
                    <p className="text-sm text-destructive">
                      {errors.extension_number}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 - Status */}
            {step === 3 && (
              <div>
                <FormLabelWithIcon
                  htmlFor="status"
                  icon={<ClipboardCheck className="h-4 w-4 text-primary" />}
                  text="Status"
                  required
                />
                <Select
                  value={formData.status}
                  onValueChange={(v) => setField("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusCustomerKeys.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 4 - Revisão */}
            {step === 4 && (
              <div className="space-y-8">
                {/* Seções */}
                {[
                  {
                    title: "Dados Pessoais",
                    items: [
                      {
                        icon: <User className="h-4 w-4 text-primary" />,
                        label: "Nome",
                        value: formData.name,
                      },
                      {
                        icon: <Mail className="h-4 w-4 text-blue-600" />,
                        label: "E-mail",
                        value: formData.email,
                      },
                      {
                        icon: <Calendar className="h-4 w-4 text-indigo-600" />,
                        label: "Data de Nascimento",
                        value: formData.birthday || "-",
                      },
                      {
                        icon: <Phone className="h-4 w-4 text-green-600" />,
                        label: "Ramal",
                        value: formData.extension_number || "-",
                      },
                    ],
                  },
                  {
                    title: "Cargo e Hierarquia",
                    items: [
                      {
                        icon: <Briefcase className="h-4 w-4 text-primary" />,
                        label: "Cargo",
                        value: getRole(formData.role),
                      },
                      {
                        icon: <Briefcase className="h-4 w-4 text-indigo-600" />,
                        label: "Ocupação",
                        value: formData.position?.name || "-",
                      },
                      {
                        icon: (
                          <User className="h-4 w-4 text-muted-foreground" />
                        ),
                        label: "Superior Imediato",
                        value: formData.immediate_superior?.name || "-",
                      },
                    ],
                  },
                  {
                    title: "Status",
                    items: [
                      {
                        icon: (
                          <ClipboardCheck className="h-4 w-4 text-primary" />
                        ),
                        label: "Status",
                        value: getStatusCustomerLabelByValue(formData.status),
                      },
                    ],
                  },
                ].map((section, idx) => (
                  <div key={idx}>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      {section.title}
                    </h4>
                    <div className="divide-y divide-muted-foreground/10">
                      {idx === 0 &&
                        (formData.avatar || formData.current_avatar) && (
                          <div className="flex items-start gap-3 py-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30 shrink-0">
                              <ImageIcon className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Avatar
                              </p>
                              <img
                                src={
                                  formData.avatar instanceof File
                                    ? URL.createObjectURL(formData.avatar)
                                    : (formData.current_avatar as string)
                                }
                                alt="Avatar"
                                className="mt-2 w-16 h-16 rounded-full object-cover border"
                              />
                            </div>
                          </div>
                        )}
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
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />{" "}
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

export default CreateUserModal;
