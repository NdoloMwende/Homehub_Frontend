import api from "./api";

export const getLandlordProperties = (landlordId: number) =>
  api.get(`/properties?landlord_id=${landlordId}`);

export const getLandlordUnits = (propertyId: number) =>
  api.get(`/units?property_id=${propertyId}`);

export const getLandlordInvoices = (landlordId: number) =>
  api.get(`/rentinvoices?landlord_id=${landlordId}`);

export const getLandlordMaintenance = (unitId: number) =>
  api.get(`/maintenance_requests?unit_id=${unitId}`);
