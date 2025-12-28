export interface MaintenanceRequest {
  id: number;
  unit_id: number;
  tenant_id: number;
  title: string;
  description: string;
  image_url?: string;
  status: "pending" | "in-progress" | "completed";
  created_at: string;
  updated_at: string;
}
