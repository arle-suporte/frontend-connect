import { checkAuth } from "@/utils/checkAuth";
import { API_URL } from "@/lib/constants";

export async function PUT(request: Request) {
  const { access, error } = await checkAuth();
  if (error) return error;

  const body = await request.json();
  const { uuid, name } = body;

  if (!uuid) {
    return new Response(
      JSON.stringify({
        detail: "UUID do departamento é obrigatório",
      }),
      {
        status: 400,
      }
    );
  }

  try {
    const res = await fetch(`${API_URL}/department/${uuid}/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return new Response(
        JSON.stringify({
          detail:
            errorData.error?.detail ||
            errorData.detail ||
            "Erro ao editar departamento",
        }),
        {
          status: res.status,
        }
      );
    }

    const departmentData = await res.json();
    return new Response(
      JSON.stringify({
        message: "Departamento editado com sucesso",
        success: true,
        data: departmentData,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro na requisição:", error);
    return new Response(
      JSON.stringify({
        detail: "Erro interno do servidor",
      }),
      {
        status: 500,
      }
    );
  }
}
