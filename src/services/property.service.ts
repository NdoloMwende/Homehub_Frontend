import axios from "axios";
import { type Property } from "../types/property";

const API_URL = "http://localhost:3000";

export const getLandlordProperties = async (
  landlordId: number
): Promise<Property[]> => {
  const response = await axios.get<Property[]>(
    `${API_URL}/properties?landlord_id=${landlordId}`
  );
  return response.data;
};
