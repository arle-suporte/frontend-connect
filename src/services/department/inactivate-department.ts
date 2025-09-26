import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const inactivateDepartment = async (uuid: string) => {
  const response = await authenticatedFetch('/auth/department/inactivate-department', {
    method: 'DELETE',
    body: JSON.stringify({
      uuid: uuid
    })
  });


  if (!response.ok) {
    const errorData = await response.json();
    toast.error('Erro ao inativar departamento.');
    throw new Error(errorData.detail || 'Erro ao inativar departamento.');
  }

  toast.success('Departamento inativado com sucesso!');
  return await response.json();
};
