export interface Lease {
  id: number;
  unit_id: number;
  tenant_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: "active" | "expired";
  document_url: string;
  created_at: string;
  updated_at: string;
}
