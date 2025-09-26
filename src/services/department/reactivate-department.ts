import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export const reactivateDepartment = async (uuid: string) => {
  const response = await authenticatedFetch('/auth/department/reactivate-department', {
    method: 'POST',
    body: JSON.stringify({
      uuid: uuid
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    toast.error('Erro ao reativar departamento.');
    throw new Error(errorData.detail || 'Erro ao reativar departamento.');
  }
  
  toast.success('Departamento reativado com sucesso!');
  return await response.json();
};
