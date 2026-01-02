import { useEffect, useState } from "react";
import {
  getPendingLandlords,
  approveLandlord,
  rejectLandlord
} from "@/services/admin.service";
import { type PendingLandlord } from "@/services/admin.service";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/services/notification.service";

const LandlordApprovals = () => {
  const { user } = useAuth();
  const adminName = user?.full_name || "Admin";

  const [landlords, setLandlords] = useState<PendingLandlord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PendingLandlord | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");
  const [approvalComment, setApprovalComment] = useState("");

  const fetchLandlords = async () => {
    try {
      const data = await getPendingLandlords();
      setLandlords(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load pending landlords", err);
      setError("Failed to load approvals queue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlords();
  }, []);

  const handleApprove = async () => {
    if (!selected) return;

    try {
      await approveLandlord(selected.id, adminName, approvalComment);
      await createNotification(
        selected.id,
        `Your landlord account has been approved${approvalComment.trim() ? `: ${approvalComment}` : "."}`
      );
      fetchLandlords();
      setSelected(null);
      setApprovalComment("");
    } catch (err) {
      console.error("Approve failed", err);
      setError("Failed to approve landlord.");
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectionComment.trim()) return;

    try {
      await rejectLandlord(selected.id, rejectionComment);
      await createNotification(
        selected.id,
        `Your landlord account has been rejected: ${rejectionComment}`
      );
      fetchLandlords();
      setSelected(null);
      setRejectionComment("");
    } catch (err) {
      console.error("Reject failed", err);
      setError("Failed to reject landlord.");
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading pending landlords..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchLandlords} />;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Landlord Approvals</h1>

      {landlords.length === 0 ? (
        <EmptyState
          title="No pending landlord approvals"
          description="New landlord registrations will appear here for review."
        />
      ) : (
        <ul className="space-y-4">
          {landlords.map(landlord => (
            <li key={landlord.id} className="border p-4 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{landlord.full_name}</p>
                  <p className="text-sm text-gray-500">{landlord.email}</p>
                </div>
                <button
                  onClick={() => setSelected(landlord)}
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
            <h2 className="text-xl font-semibold">Review {selected.full_name}</h2>

            <div>
              <p className="font-medium">National ID</p>
              <p>{selected.national_id || "Not provided"}</p>
              {selected.evidence_of_identity && (
                <a
                  href={selected.evidence_of_identity}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View ID Document
                </a>
              )}
            </div>

            <div>
              <p className="font-medium">Property Ownership Evidence</p>
              {selected.property_evidence ? (
                <a
                  href={selected.property_evidence}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Title Deed / Evidence
                </a>
              ) : (
                <p>No property evidence submitted</p>
              )}
            </div>

            {/* Approval Comment (optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Approval Comment (optional)</label>
              <textarea
                placeholder="Leave empty for default approval message"
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="border p-2 w-full rounded"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                className="border px-4 py-2 bg-green-100 hover:bg-green-200"
              >
                Approve
              </button>

              <div className="flex-1 space-y-2">
                <input
                  placeholder="Reason for rejection (required)"
                  value={rejectionComment}
                  onChange={(e) => setRejectionComment(e.target.value)}
                  className="border p-2 w-full"
                />
                <button
                  onClick={handleReject}
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
                setApprovalComment("");
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

export default LandlordApprovals;