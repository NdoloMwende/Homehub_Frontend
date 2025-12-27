export interface Property {
  id: number;
  landlord_id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  status: string;
  created_at: string;
  updated_at: string;

  // optional / future
  description?: string;
  image_url?: string;
  evidence_of_ownership?: string;
  lrn_no?: string;
  location?: string;
  comment?: string | null;
}
