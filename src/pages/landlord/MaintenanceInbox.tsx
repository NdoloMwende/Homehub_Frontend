import { useEffect, useState } from "react";
import {
  getMaintenanceByLandlord,
  updateMaintenanceStatus
} from "@/services/maintenance.service";
import { type MaintenanceRequest } from "@/types/maintenance";

const LANDLORD_ID = 2;

const MaintenanceInbox = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

 const fetchRequests = async () => {
    try {
      const data = await getMaintenanceByLandlord(LANDLORD_ID);
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };
  useEffect(() => {
    fetchRequests().finally(() => setLoading(false));
  }, [refreshTrigger]);

  const handleStatusChange = async (
    id: number,
    status: "pending" | "in-progress" | "completed"
  ) => {
    try {
      await updateMaintenanceStatus(id, status);
      // Force refresh by changing trigger
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) return <p>Loading maintenance inbox...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Maintenance Inbox</h1>

      {requests.length === 0 ? (
        <p>No maintenance requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map(req => (
            <li key={req.id} className="border p-4 rounded space-y-2">
              <h3 className="font-medium">{req.title}</h3>
              <p>{req.description}</p>
              <p>Status: {req.status}</p>

              <div className="flex gap-2">
                {req.status !== "in-progress" && req.status !== "completed" && (
                  <button
                    className="border px-3 py-1 hover:bg-gray-100"
                    onClick={() =>
                      handleStatusChange(req.id, "in-progress")
                    }
                  >
                    Mark In Progress
                  </button>
                )}

                {req.status !== "completed" && (
                  <button
                    className="border px-3 py-1 hover:bg-gray-100"
                    onClick={() =>
                      handleStatusChange(req.id, "completed")
                    }
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaintenanceInbox;