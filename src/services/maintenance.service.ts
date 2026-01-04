import api from "./api";
import { type MaintenanceRequest } from "@/types/maintenance";

export const getTenantMaintenanceRequests = async (tenantId: number) => {
  const res = await api.get(`/maintenance_requests?tenant_id=${tenantId}`);
  return res.data;
};

export const createMaintenanceRequest = async (
  payload: Omit<MaintenanceRequest, "id" | "created_at" | "updated_at">
) => {
  const res = await api.post("/maintenance_requests", payload);
  return res.data;
};

export const getMaintenanceByLandlord = async (landlordId: number) => {
  const res = await api.get<MaintenanceRequest[]>(
    `/maintenance_requests?landlord_id=${landlordId}`
  );
  return res.data;
};

export const updateMaintenanceStatus = async (
  id: number,
  status: "pending" | "in-progress" | "completed"
) => {
  const res = await api.patch(`/maintenance_requests/${id}`, {
    status
  });
  return res.data;
};