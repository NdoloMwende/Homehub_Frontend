export interface Unit {
  id: number;
  property_id: number;
  unit_number: string;
  floor_number?: string;
  rent_amount: number;
  status: "available" | "occupied";
  created_at: string;
  updated_at: string;
}
