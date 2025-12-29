import api from "./api";
import { type RentInvoice } from "../types/rentinvoice";

export const getInvoicesByLandlord = async (
  landlordId: number
): Promise<RentInvoice[]> => {
  const res = await api.get(`/rentinvoices?landlord_id=${landlordId}`);
  return res.data;
};

export const getTenantInvoices = async (
  tenantId: number
): Promise<RentInvoice[]> => {
  const res = await api.get(`/rentinvoices?tenant_id=${tenantId}`);
  return res.data;
};
