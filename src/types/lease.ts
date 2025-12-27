export interface Lease {
  id: number;
  unit_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: "active" | "expired";
  created_at: string;
  updated_at: string;
}
