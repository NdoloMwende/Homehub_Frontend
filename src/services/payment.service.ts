import axios from "axios";
import { type RentInvoice } from "../types/rentinvoice";

import api from "./api";

const API_URL = "http://localhost:3000";

export const getInvoicesByLandlord = async (
  landlordId: number
): Promise<RentInvoice[]> => {
  const res = await axios.get<RentInvoice[]>(
    `${API_URL}/rentinvoices?landlord_id=${landlordId}`
  );
  return res.data;
};

export const getTenantInvoices = async (tenantId: number) => {
  const res = await api.get(`/rentinvoices?tenant_id=${tenantId}`);
  return res.data;
};