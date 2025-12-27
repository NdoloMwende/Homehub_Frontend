import axios from "axios";
import { type RentInvoice } from "../types/invoice";

const API_URL = "http://localhost:3000";

export const getInvoicesByLandlord = async (
  landlordId: number
): Promise<RentInvoice[]> => {
  const res = await axios.get<RentInvoice[]>(
    `${API_URL}/rentinvoices?landlord_id=${landlordId}`
  );
  return res.data;
};
