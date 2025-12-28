import { useEffect, useState } from "react";
import {
  getTenantMaintenanceRequests,
  createMaintenanceRequest
} from "@/services/maintenance.service";
import { type MaintenanceRequest } from "@/types/maintenance";

const TENANT_ID = 3; // mock logged-in tenant
const UNIT_ID = 1; // mock unit ID for the tenant

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchRequests = async () => {
  const data = await getTenantMaintenanceRequests(TENANT_ID);
  setRequests(data);
  };

  useEffect(() => {
    fetchRequests().finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    await createMaintenanceRequest({
      tenant_id: TENANT_ID,
      unit_id: UNIT_ID,
      title,
      description,
      status: "pending"
    });

    setTitle("");
    setDescription("");
    fetchRequests();
  };

  if (loading) return <p>Loading maintenance requests...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Maintenance Requests</h1>

      {/* Create request */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Issue title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
        <button type="submit" className="border px-4 py-2">
          Submit Request
        </button>
      </form>

      {/* List */}
      {requests.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map(req => (
            <li key={req.id} className="border p-4 rounded">
              <h3 className="font-medium">{req.title}</h3>
              <p>{req.description}</p>
              <p className="text-sm">Status: {req.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MaintenanceRequests;
