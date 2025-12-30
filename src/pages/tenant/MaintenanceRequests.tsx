import { useEffect, useState } from "react";
import {
  getTenantMaintenanceRequests,
  createMaintenanceRequest
} from "@/services/maintenance.service";
import { type MaintenanceRequest } from "@/types/maintenance";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useAuth } from "@/context/AuthContext";

const MaintenanceRequests = () => {
  const { user } = useAuth();
  const tenantId = user?.id;
  const unitId = 1; // temporary — will be dynamic later

  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchRequests = async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getTenantMaintenanceRequests(tenantId);
      setRequests(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load requests", err);
      setError("Failed to load maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [tenantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !tenantId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await createMaintenanceRequest({
        tenant_id: tenantId,
        unit_id: unitId,
        title,
        description,
        status: "pending"
      });

      setTitle("");
      setDescription("");
      fetchRequests();
    } catch (err) {
      alert("Failed to submit request. Please try again.");
    }
  };

  if (!user) {
    return <p>Please log in to view maintenance requests.</p>;
  }

  if (loading) {
    return <LoadingSpinner message="Loading maintenance requests..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchRequests} />;
  }

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
          required
        />
        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="border px-4 py-2">
          Submit Request
        </button>
      </form>

      {/* List */}
      {requests.length === 0 ? (
        <EmptyState
          title="No maintenance requests"
          description="Submit a request when you need assistance with your unit."
        />
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