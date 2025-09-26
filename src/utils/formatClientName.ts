export const formatClientName = (
  trade_name: string,
  federal_registration: string
) => {
  const name = trade_name;
  if (federal_registration) {
    return `${name} - ${federal_registration}`;
  }
  return name;
};
