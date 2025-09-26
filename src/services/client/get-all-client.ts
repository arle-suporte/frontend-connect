import { fetchAuthClients } from "./get-clients";

export async function getAllClients(filters: any) {
  let allResults: any[] = [];
  let page = 1;
  const pageSize = 100; // pode ajustar se sua API suportar maior

  while (true) {
    const data = await fetchAuthClients(filters, page, pageSize);

    allResults = [...allResults, ...data.results];

    if (!data.next) break; // se não houver próxima página, encerra
    page++;
  }

  return allResults;
}
