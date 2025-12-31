import { useEffect, useState } from "react";
import { getActiveLeaseForTenant } from "@/services/lease.service";
import { type Lease } from "@/types/lease";
import api from "@/services/api";

const TENANT_ID = 3;

interface DocumentItem {
  label: string;
  url: string | null;
}

const TenantDocuments = () => {
  const [lease, setLease] = useState<Lease | null>(null);
  const [propertyEvidence, setPropertyEvidence] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // 1. Get active lease
        const leaseData = await getActiveLeaseForTenant(TENANT_ID);
        setLease(leaseData);

        if (leaseData) {
          // 2. Get property evidence (via unit -property)
          const unitsRes = await api.get(
            `/units?tenant_id=${TENANT_ID}`
          );
          if (unitsRes.data.length > 0) {
            const propertyRes = await api.get(
              `/properties/${unitsRes.data[0].property_id}`
            );
            setPropertyEvidence(propertyRes.data.evidence_of_ownership);
          }
        }
      } catch (err) {
        console.error("Failed to load documents", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const documents: DocumentItem[] = [
    {
      label: "Lease Agreement",
      url: lease?.document_url || null,
    },
    {
      label: "Property Title Deed / Ownership Evidence",
      url: propertyEvidence || null,
    },
  ];

  if (loading) return <p>Loading documents...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Documents</h1>

      <section>
        {documents.every(doc => doc.url === null) ? (
          <p>No documents available at this time.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc, index) => (
              doc.url ? (
                <li key={index} className="border p-4 rounded">
                  <p className="font-medium">{doc.label}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View / Download
                  </a>
                </li>
              ) : null
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TenantDocuments;