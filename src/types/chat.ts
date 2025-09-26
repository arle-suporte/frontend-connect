export interface Message {
  uuid: string;
  timestamp: string;
  from_me: boolean;
  text: string;
  has_media: boolean;
  media_type: string;
  media_file: string;
  file_name: string;
}

export interface ContactType {
  uuid: string;
  name: string;
  contact_name: string;
  photo: string;
  phone_number: any;
  client: string;
  active: boolean;
  results: any;
  length: number;
  is_group: boolean;
  is_deleted: boolean;
  organization: any;
  active_service_user: string | null;
  active_service_status: string | null;
  active_service_uuid: string | null;
}

export interface ServiceType {
  uuid: string;
  status: any;
  contact: string;
  chat_id?: string;
  contact_name?: string;
  contact_photo?: string;
  user?: string;
  unread_messages_count?: number;
  messages?: Message[];
  contact_is_group?: boolean;
}

export interface ContactsData {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContactType[];
}

export interface ChatState {
  selectedContact: ContactType | null;
  messages: Record<string, Message[]>;
  contacts: ContactType[];
  isLoading: boolean;
}
