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

  // Enrich with property evidence (first property only for MVP)
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

export const approveLandlord = async (id: number, comment?: string) => {
  return api.patch(`/users/${id}`, { 
    status: "approved", 
    comment: comment || null 
  });
};

export const rejectLandlord = async (id: number, comment: string) => {
  return api.patch(`/users/${id}`, { 
    status: "rejected", 
    comment 
  });
};