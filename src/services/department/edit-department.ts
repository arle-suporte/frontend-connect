import { authenticatedFetch } from "@/lib/api-client";
import { toast } from "sonner";

export async function editDepartment(uuid: string, name: string) {
  const response = await authenticatedFetch(
    `/auth/department/edit-department`,
    {
      method: "PUT",
      body: JSON.stringify({
        uuid: uuid,
        name: name,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Erro ao editar departamento.");
  }

  toast.success("Departmento editado com sucesso!");
  return await response.json();
}
