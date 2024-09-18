export type Category = {
  id: number;
  created_at: string;
  name: string;
  description: string | null;
  parent_category: string | null;
};

export type EventType = {
  id: number;
  created_at: string;
  venue: string;
  address_line_1: string;
  address_line_2: string;
  country_code: string | null;
  country: string | null;
  city: string;
  zip_postal_code: string;
  state: string;
  capacity: number | null;
  latitude: number;
  longitude: number;
};
