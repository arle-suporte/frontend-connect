import { fetchAuthUsers } from "./get-users";

export async function getAllUser(filters: any) {
  let allResults: any[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const data = await fetchAuthUsers(filters, page, pageSize);

    allResults = [...allResults, ...data.results];

    if (!data.next) break;
    page++;
  }

  return allResults;
}
