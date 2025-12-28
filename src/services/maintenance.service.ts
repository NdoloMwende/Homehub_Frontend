import api from "./api";
import { type MaintenanceRequest } from "@/types/maintenance";

export const getTenantMaintenanceRequests = async (
  tenantId: number
): Promise<MaintenanceRequest[]> => {
  const res = await api.get(
    `/maintenance_requests?tenant_id=${tenantId}`
  );
  return res.data;
};

export const createMaintenanceRequest = async (
  payload: Omit<MaintenanceRequest, "id" | "created_at" | "updated_at">
) => {
  const res = await api.post("/maintenance_requests", payload);
  return res.data;
};
