import axios from "axios";
import { type Lease } from "../types/lease";
import { type User } from "../types/user";
// import api from "./api";

const API_URL = "http://localhost:3000";

export const getLeaseByUnit = async (
  unitId: number
): Promise<Lease[]> => {
  const res = await axios.get<Lease[]>(
    `${API_URL}/leases?unit_id=${unitId}&status=active`
  );
  return res.data;
};

export const getTenantById = async (
  tenantId: number
): Promise<User> => {
  const res = await axios.get<User>(`${API_URL}/users/${tenantId}`);
  return res.data;
};

export const getActiveLeaseForTenant = async (
  tenantId: number
): Promise<Lease | null> => {
  const res = await axios.get<Lease[]>(
    `${API_URL}/leases?tenant_id=${tenantId}&status=active`
  );
  return res.data.length > 0 ? res.data[0] : null;
};