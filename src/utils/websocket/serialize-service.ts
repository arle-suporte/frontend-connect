export function createServiceFromEvent(evt: any, contactByPhone: any) {
  // Os dados estão diretamente no evt, não em evt.message
  const contactId = evt.contact_id;

  if (!contactId) return null;

  let contact = contactByPhone.get(contactId);

  // Se o contato não existe, cria um contato temporário
  if (!contact) {
    contact = {
      uuid: `${contactId}`,
      phone_number: contactId,
      name: evt.contact_name || evt.message?.contact_name || contactId,
      photo: evt.contact_photo || evt.message?.contact_photo || null,
      is_group: contactId.includes('@g.us'),
      profile_picture: evt.contact_photo || evt.message?.contact_photo || null,
    };

    // Adiciona ao mapeamento para próximas vezes
    contactByPhone.set(contactId, contact);
  }

  return {
    uuid: evt.uuid || evt.service_id,
    status: evt.message.status,
    contact: contact.uuid,
    contact_full: contact,
    contact_name: contact.name,
    contact_photo: contact.photo || evt.contact_photo || "",
    user: evt.user_name || undefined,
    unread_messages_count: evt.unread_messages_count || 0,
    messages: [],
    // Campos adicionais do payload
    started_at: evt.started_at,
    created_at: evt.created_at,
    finished_at: evt.finished_at,
  };
}