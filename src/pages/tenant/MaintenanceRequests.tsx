import { useEffect, useState } from "react";
import { getTenantMaintenanceRequests } from "@/services/maintenance.service";
import { type MaintenanceRequest } from "@/types/maintenance";

const TENANT_ID = 3; // mock logged-in tenant

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getTenantMaintenanceRequests(TENANT_ID);
        setRequests(data);
      } catch (err) {
        console.error("Failed to load maintenance requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading maintenance requests...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Maintenance Requests</h1>

      {requests.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map(req => (
            <li key={req.id} className="border p-4 rounded">
              <h3 className="font-medium">{req.title}</h3>
              <p>{req.description}</p>
              <p className="text-sm text-gray-500">
                Status: {req.status}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaintenanceRequests;
