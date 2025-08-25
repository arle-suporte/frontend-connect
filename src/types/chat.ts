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
  photo: string;
  phone_number: string;
  active: boolean;
  results: any;
  length: number;
  is_group: boolean;
  is_deleted: boolean
}
export interface ChatState {
  selectedContact: ContactType | null;
  messages: Record<string, Message[]>;
  contacts: ContactType[];
  isLoading: boolean;
}