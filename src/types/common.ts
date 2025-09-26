export interface CustomerCommonType {
  uuid: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface ClientCommonType {
  uuid: string;
  federal_registration: string;
  trade_name: string;
}

export interface CommonType {
  uuid: string;
  name: string;
}
