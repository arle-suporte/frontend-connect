export const transformContactData = (apiContacts: any[]) => {
  if (!Array.isArray(apiContacts)) return [];

  return apiContacts
    .filter((contact) => !contact.is_group) // Remove grupos antes de transformar
    .map((contact) => {
      // Remove @c.us do telefone
      const cleanPhone = contact.phone_number.replace("@c.us", "");

      // Se o nome for igual ao phone_number, usa apenas o número limpo
      // Senão, usa o nome real
      const displayName =
        contact.name === contact.phone_number ? cleanPhone : contact.name;

      return {
        id: contact.uuid,
        nome: displayName,
        telefone: cleanPhone,
        photo: contact.photo,
        active: contact.active,
        client: contact.client,
        is_deleted: contact.is_deleted,
      };
    });
};

export const cleanPhone = (phone: string): string => {
  if (!phone) return "";

  if (phone.includes("@g.us")) {
    return "Grupo";
  }

  if (phone.includes("@c.us")) {
    return phone.replace("@c.us", "");
  }

  return phone;
};

export const displayName = (name: string, phone: string) => {
  return name === phone ? cleanPhone(phone) : name;
};
