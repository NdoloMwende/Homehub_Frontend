import { useEffect, useState } from "react";
import {
  getPendingProperties,
  approveProperty,
  rejectProperty
} from "@/services/admin.service";
import { type PendingProperty } from "@/services/admin.service";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";

const PropertyVerification = () => {
  const [properties, setProperties] = useState<PendingProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PendingProperty | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");

  const fetchProperties = async () => {
    try {
      const data = await getPendingProperties();
      setProperties(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load pending properties", err);
      setError("Failed to load verification queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleApprove = async (id: number) => {
    await approveProperty(id);
    fetchProperties();
    setSelected(null);
  };

  const handleReject = async (id: number) => {
    if (!rejectionComment.trim()) return;
    await rejectProperty(id, rejectionComment);
    fetchProperties();
    setSelected(null);
    setRejectionComment("");
  };

  if (loading) {
    return <LoadingSpinner message="Loading pending properties..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProperties} />;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Property Verification</h1>

      {properties.length === 0 ? (
        <EmptyState
          title="No pending property verifications"
          description="New property listings will appear here for review."
        />
      ) : (
        <ul className="space-y-4">
          {properties.map(prop => (
            <li key={prop.id} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{prop.name}</p>
                  <p className="text-sm text-gray-500">
                    Landlord: {prop.landlord_name}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(prop)}
                  className="border px-3 py-1"
                >
                  Review
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full space-y-4">
            <h2 className="text-xl font-semibold">Review {selected.name}</h2>

            <div>
              <p className="font-medium">Ownership Evidence</p>
              {selected.evidence_of_ownership ? (
                <a
                  href={selected.evidence_of_ownership}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Title Deed / Evidence
                </a>
              ) : (
                <p>No ownership evidence submitted</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => handleApprove(selected.id)}
                className="border px-4 py-2 bg-green-100 hover:bg-green-200"
              >
                Approve
              </button>

              <div className="flex-1 space-y-2">
                <input
                  placeholder="Reason for rejection (required)"
                  value={rejectionComment}
                  onChange={e => setRejectionComment(e.target.value)}
                  className="border p-2 w-full"
                />
                <button
                  onClick={() => handleReject(selected.id)}
                  disabled={!rejectionComment.trim()}
                  className="border px-4 py-2 bg-red-100 hover:bg-red-200 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setSelected(null);
                setRejectionComment("");
              }}
              className="text-sm underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyVerification;