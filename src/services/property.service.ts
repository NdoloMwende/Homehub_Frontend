import axios from "axios";
import { type Property } from "../types/property";
import {type Unit} from "../types/unit";

const API_URL = "http://localhost:3000";

export const getLandlordProperties = async (
  landlordId: number
): Promise<Property[]> => {
  const response = await axios.get<Property[]>(
    `${API_URL}/properties?landlord_id=${landlordId}`
  );
  return response.data;
};

export const getPropertyById = async (
  id: number
): Promise<Property> => {
  const res = await axios.get<Property>(`${API_URL}/properties/${id}`);
  return res.data;
};

export const getUnitsByProperty = async (
  propertyId: number
): Promise<Unit[]> => {
  const res = await axios.get<Unit[]>(
    `${API_URL}/units?property_id=${propertyId}`
  );
  return res.data;
};