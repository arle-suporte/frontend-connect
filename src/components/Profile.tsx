"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  User,
  Calendar,
  Lock,
  Save,
  Briefcase,
  ClipboardCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AvatarUploader } from "@/components/ui/AvatarUploader";
import { useZodForm } from "@/hooks/useZodForm";
import { profileSchema, ProfileFormData } from "@/schemas/profile";
import { Styles } from "@/styles/list";
import {
  getRole,
  getStatusCustomerLabelByValue,
  getStatusTitle,
} from "@/utils/status";
import { updateProfile } from "@/services/user/update-profile";
import { formatDate } from "@/utils/time";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileModal({
  open,
  onOpenChange,
}: ProfileModalProps) {
  const { user } = useAuth();

  const { formData, setField, errors, validate, setBackendErrors } = useZodForm(
    profileSchema,
    {
      avatar: null,
      new_password: "",
      confirm_password: "",
    } as ProfileFormData
  );
  const handleSave = async () => {
    if (!validate()) return;

    try {
      const result = await updateProfile({
        avatar: formData.avatar as File | null,
        new_password: formData.new_password || undefined,
        confirm_password: formData.confirm_password || undefined,
      });

      console.log("Perfil atualizado:", result);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Erro do backend:", err);

      if (err.data) {
        const backendDetail =
          err.data.error?.detail || err.data.detail || err.data;

        if (backendDetail.non_field_errors) {
          setBackendErrors({
            new_password: backendDetail.non_field_errors,
          });
        } else {
          setBackendErrors(backendDetail);
        }
      } else {
        setBackendErrors({
          new_password: "Erro inesperado ao atualizar perfil",
        });
      }
    }
  };

  const sections = [
    {
      title: "Dados Pessoais",
      items: [
        {
          icon: <User className="h-4 w-4 text-primary" />,
          label: "Nome",
          value: user?.name,
        },
        {
          icon: <Mail className="h-4 w-4 text-blue-600" />,
          label: "E-mail",
          value: user?.email,
        },
        {
          icon: <Calendar className="h-4 w-4 text-indigo-600" />,
          label: "Data de Nascimento",
          value: user?.birthday ? formatDate(user.birthday) : "-",
        },
      ],
    },
    {
      title: "Cargo e Hierarquia",
      items: [
        {
          icon: <Briefcase className="h-4 w-4 text-primary" />,
          label: "Cargo",
          value: getRole(user?.role),
        },
        {
          icon: <Briefcase className="h-4 w-4 text-indigo-600" />,
          label: "Ocupação",
          value: user?.position?.name || "-",
        },
        {
          icon: <Briefcase className="h-4 w-4 text-primary" />,
          label: "Ramal",
          value: user?.extension_number || "-",
        },
        {
          icon: <User className="h-4 w-4 text-muted-foreground" />,
          label: "Superior Imediato",
          value: user?.immediate_superior?.name || "-",
        },
      ],
    },
    {
      title: "Status",
      items: [
        {
          icon: <ClipboardCheck className="h-4 w-4 text-primary" />,
          value: user?.status
            ? getStatusCustomerLabelByValue(user.status)
            : "-",
          help: user?.status_help_text,
        },
      ],
    },
    {
      title: "Alterar Senha",
      items: [
        {
          icon: <Lock className="h-4 w-4 text-primary" />,
          label: "Nova Senha",
          field: (
            <>
              <Input
                id="new_password"
                autoComplete="new-password"
                type="password"
                value={formData.new_password}
                onChange={(e) => setField("new_password", e.target.value)}
                placeholder="Digite a nova senha"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {errors.new_password && (
                <p className="text-sm text-destructive">
                  {errors.new_password}
                </p>
              )}
            </>
          ),
        },
        {
          icon: <Lock className="h-4 w-4 text-primary" />,
          label: "Confirmar Senha",
          field: (
            <>
              <Input
                id="confirm_password"
                autoComplete="new-password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setField("confirm_password", e.target.value)}
                placeholder="Confirme a nova senha"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {errors.confirm_password && (
                <p className="text-sm text-destructive">
                  {errors.confirm_password}
                </p>
              )}
            </>
          ),
        },
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-3">
          <DialogTitle className="text-xl font-semibold">
            Meu Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-8 py-4">
            <AvatarUploader
              avatar={formData.avatar}
              currentAvatar={user?.avatar}
              onChange={(file) => setField("avatar", file)}
              onRemove={() => setField("avatar", null)}
            />

            {sections.map((section, idx) => (
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
                      <div className="min-w-0 flex-1">
                        {"label" in item && item.label && (
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            {item.label}
                          </p>
                        )}
                        {"field" in item && item.field ? (
                          <div className="mt-1">{item.field}</div>
                        ) : (
                          <p className={Styles.default_text}>{"value" in item && item.value}</p>
                        )}
                        {"help" in item && item.help && (
                          <p className="text-xs text-muted-foreground mt-1 break-words">
                            {item.help}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
