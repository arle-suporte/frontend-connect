import { getDepartments } from "./get-departments";

export async function getAllDpto(filters: any) {
  let allResults: any[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const data = await getDepartments(filters, page, pageSize);

    allResults = [...allResults, ...data.results];

    if (!data.next) break;
    page++;
  }

  return allResults;
}
