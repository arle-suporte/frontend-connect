import { getServicesPaginated } from "./get-services";

export async function getAllServices(filters: any) {
  let allResults: any[] = [];
  let page = 1;
  const pageSize = 100; // pode ajustar se sua API suportar maior

  while (true) {
    const data = await getServicesPaginated(filters, page, pageSize);

    allResults = [...allResults, ...data.results];

    if (!data.next) break; // se não houver próxima página, encerra
    page++;
  }

  return allResults;
}
