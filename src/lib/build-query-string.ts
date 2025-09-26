export const buildQueryString = (
  filters: Record<string, string> = {},
  page: number,
  size: number,
) => {
  const params = new URLSearchParams();

  params.set('page', page.toString());
  params.set('page_size', size.toString());

  Object.entries({ ...filters, }).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim()) {
      params.set(key, value);
    }
  });

  return params.toString();
};