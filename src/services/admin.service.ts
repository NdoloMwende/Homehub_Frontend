import api from "./api";

export interface PendingLandlord {
  id: number;
  full_name: string;
  email: string;
  national_id: string;
  evidence_of_identity: string | null;
  property_evidence: string | null;
  comment: string | null;
}

export const getPendingLandlords = async (): Promise<PendingLandlord[]> => {
  const res = await api.get("/users?role=landlord&status=pending");
  const landlords = res.data;

  const enriched = await Promise.all(
    landlords.map(async (landlord: any) => {
      const propRes = await api.get(`/properties?landlord_id=${landlord.id}&_limit=1`);
      const propertyEvidence = propRes.data.length > 0 
        ? propRes.data[0].evidence_of_ownership 
        : null;

      return {
        ...landlord,
        property_evidence: propertyEvidence
      };
    })
  );

  return enriched;
};

const generateApprovalComment = (entityName: string, adminName: string) => {
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${entityName} has been approved by ${adminName} on ${date}.`;
};

export const approveLandlord = async (
  id: number,
  adminName: string,
  customComment?: string
) => {
  // Fetch landlord name for default comment
  const landlordRes = await api.get(`/users/${id}`);
  const landlordName = landlordRes.data.full_name;

  const comment = customComment?.trim() || generateApprovalComment(landlordName, adminName);

  return api.patch(`/users/${id}`, { 
    status: "approved", 
    comment 
  });
};

export const rejectLandlord = async (id: number, comment: string) => {
  return api.patch(`/users/${id}`, { 
    status: "rejected", 
    comment 
  });
};

export interface PendingProperty {
  id: number;
  name: string;
  landlord_id: number;
  landlord_name: string;
  evidence_of_ownership: string | null;
  comment: string | null;
}

export const getPendingProperties = async (): Promise<PendingProperty[]> => {
  const res = await api.get("/properties?status=pending");
  const properties = res.data;

  const enriched = await Promise.all(
    properties.map(async (prop: any) => {
      const landlordRes = await api.get(`/users/${prop.landlord_id}`);
      return {
        ...prop,
        landlord_name: landlordRes.data.full_name
      };
    })
  );

  return enriched;
};

export const approveProperty = async (
  id: number,
  adminName: string,
  customComment?: string
) => {
  // Fetch property name for default comment
  const propertyRes = await api.get(`/properties/${id}`);
  const propertyName = propertyRes.data.name;

  const comment = customComment?.trim() || generateApprovalComment(propertyName, adminName);

  return api.patch(`/properties/${id}`, { 
    status: "approved", 
    comment 
  });
};

export const rejectProperty = async (id: number, comment: string) => {
  return api.patch(`/properties/${id}`, { 
    status: "rejected", 
    comment 
  });
};