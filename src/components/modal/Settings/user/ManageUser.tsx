"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Lock,
  Save,
  Loader2,
  Mail,
  Calendar,
  Briefcase,
  ClipboardCheck,
} from "lucide-react";

import { editUser } from "@/services/user/edit-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLabelWithIcon } from "@/components/ui/form-label-with-icon";
import { getStatusCustomerKeys } from "@/utils/status";
import { userSchema, UserFormData } from "@/schemas/user";
import { useZodForm } from "@/hooks/useZodForm";
import { getAllPositions, getAllCustomers } from "@/utils/getAll";
import { CommonSelect } from "@/components/ui/CommonSelect";
import { AvatarUploader } from "@/components/ui/AvatarUploader";

interface ManageUserModalProps {
  open: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  userData: any;
}

const ManageUserModal: React.FC<ManageUserModalProps> = ({
  open,
  onClose,
  onUserUpdated,
  userData,
}) => {
  const { formData, setField, setFormData, errors, validate } = useZodForm(
    userSchema,
    {
      name: "",
      email: "",
      extension_number: "",
      birthday: "",
      role: "member",
      status: "active",
      position: null,
      immediate_superior: null,
      permissions: [],
      avatar: null,
      current_avatar: "",
    } as UserFormData
  );

  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState<{ uuid: string; name: string }[]>(
    []
  );
  const [users, setUsers] = useState<
    { uuid: string; name: string; email: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      setPositions(await getAllPositions());
      setUsers(await getAllCustomers());
    })();
  }, []);

  useEffect(() => {
    if (open && userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        birthday: userData.birthday || "",
        role: userData.role || "",
        permissions: userData.permissions || [],
        extension_number: userData.extension_number || "",
        status: userData.status || "active",
        position: userData.position,
        immediate_superior: userData.immediate_superior,
        avatar: userData.avatar || "",
        current_avatar: userData.avatar || "",
      });
    }
  }, [open, userData, setFormData]);

  if (!userData) return null;

  const handlePermissionChange = (permission: any, checked: boolean) => {
    setField(
      "permissions",
      checked
        ? [...(formData.permissions || []), permission]
        : (formData.permissions || []).filter((p) => p.uuid !== permission.uuid)
    );
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await editUser({ ...formData, uuid: userData.uuid });
      onUserUpdated?.();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b pb-3">
          <DialogTitle className="text-xl font-semibold">
            Editar Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-8 py-4">
            <Tabs defaultValue="profile" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="permissions">Permissões</TabsTrigger>
              </TabsList>

              {/* Aba Perfil */}
              <TabsContent
                value="profile"
                className="flex-1 overflow-y-auto px-1"
              >
                <div className="space-y-8 py-4">
                  <div className="grid gap-6 py-4">
                    {/* Dados Pessoais */}

                    <AvatarUploader
                      avatar={formData.avatar}
                      currentAvatar={formData.current_avatar}
                      onChange={(file) => {
                        setField("avatar", file);
                        setField("current_avatar", "");
                      }}
                      onRemove={() => {
                        setField("avatar", null);
                        setField("current_avatar", "");
                      }}
                    />

                    <section className="grid gap-4">
                      <h3 className="font-semibold border-b pb-1 text-sm text-muted-foreground">
                        Dados Pessoais
                      </h3>
                      <FormLabelWithIcon
                        htmlFor="name"
                        icon={<User className="h-4 w-4 text-primary" />}
                        text="Nome"
                        required
                      />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setField("name", e.target.value)}
                        disabled={isLoading}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">
                          {errors.name}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabelWithIcon
                            htmlFor="email"
                            icon={<Mail className="h-4 w-4 text-blue-600" />}
                            text="E-mail"
                            required
                          />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setField("email", e.target.value)}
                            disabled={isLoading}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <FormLabelWithIcon
                            htmlFor="birthday"
                            icon={
                              <Calendar className="h-4 w-4 text-indigo-600" />
                            }
                            text="Aniversário"
                          />
                          <Input
                            id="birthday"
                            type="date"
                            value={formData.birthday || ""}
                            onChange={(e) =>
                              setField("birthday", e.target.value)
                            }
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </section>

                    {/* Função e Cargo */}
                    <section className="grid gap-4">
                      <h3 className="font-semibold border-b pb-1 text-sm text-muted-foreground">
                        Função e Cargo
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabelWithIcon
                            htmlFor="role"
                            icon={
                              <Briefcase className="h-4 w-4 text-primary" />
                            }
                            text="Função"
                            required
                          />
                          <Select
                            value={formData.role}
                            onValueChange={(v) => setField("role", v)}
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                Administrador
                              </SelectItem>
                              <SelectItem value="owner">
                                Proprietário
                              </SelectItem>
                              <SelectItem value="member">Membro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <FormLabelWithIcon
                            htmlFor="position"
                            icon={
                              <Briefcase className="h-4 w-4 text-indigo-600" />
                            }
                            text="Cargo"
                          />
                          <CommonSelect
                            getAll={getAllPositions}
                            value={formData.position}
                            onChange={(val) => setField("position", val)}
                            valueField="uuid"
                            labelField={["name"]}
                            placeholder="Selecione uma Ocupação"
                            mode="object"
                            searchable
                          />
                          {errors.position && (
                            <p className="text-sm text-destructive">
                              {errors.position}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabelWithIcon
                            htmlFor="immediate_superior"
                            icon={
                              <Briefcase className="h-4 w-4 text-indigo-600" />
                            }
                            text="Superior Imediato"
                          />
                          <CommonSelect
                            getAll={getAllCustomers}
                            value={formData.immediate_superior}
                            onChange={(val) =>
                              setField("immediate_superior", val)
                            }
                            valueField="uuid"
                            labelField={["name", "email"]}
                            placeholder="Selecione um Superior Imediato"
                            mode="object"
                          />
                          {errors.immediate_superior && (
                            <p className="text-sm text-destructive">
                              {errors.immediate_superior}
                            </p>
                          )}
                        </div>
                        <div>
                          <FormLabelWithIcon
                            htmlFor="extension_number"
                            icon={
                              <Briefcase className="h-4 w-4 text-indigo-600" />
                            }
                            text="Ramal"
                          />
                          <Input
                            id="extension_number"
                            value={formData.extension_number || ""}
                            onChange={(e) =>
                              setField("extension_number", e.target.value)
                            }
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div>
                        <FormLabelWithIcon
                          htmlFor="status"
                          icon={
                            <ClipboardCheck className="h-4 w-4 text-primary" />
                          }
                          text="Status"
                          required
                        />
                        <Select
                          value={formData.status}
                          onValueChange={(v) => setField("status", v)}
                          disabled={isLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {getStatusCustomerKeys.map((v) => (
                              <SelectItem key={v.value} value={v.value}>
                                {v.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </section>
                  </div>
                </div>
              </TabsContent>

              {/* Aba Permissões */}
              <TabsContent
                value="permissions"
                className="flex-1 overflow-y-auto px-1"
              >
                <ScrollArea className="h-full max-h-[450px] pr-4">
                  <div className="space-y-3 py-4">
                    {formData.permissions?.map((permission) => (
                      <div
                        key={permission.uuid}
                        className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <Label
                            htmlFor={permission.uuid}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {permission.codename}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {permission.description || "-"}
                          </p>
                        </div>
                        <Switch
                          id={permission.uuid}
                          checked={true}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission, checked)
                          }
                          disabled={isLoading}
                        />
                      </div>
                    ))}

                    {(!formData.permissions ||
                      formData.permissions.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Lock className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Nenhuma permissão atribuída</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageUserModal;
