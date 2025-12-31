import { useEffect, useState } from "react";
import api from "../../services/api";
import MetricCard from "@/components/common/MetricCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const LandlordDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const landlordId = user?.id;

  const [properties, setProperties] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const fetchData = async () => {
    if (!landlordId) {
      setLoading(false);
      return;
    }

    try {
      const [propRes, unitRes, invRes, maintRes] = await Promise.all([
        api.get(`/properties?landlord_id=${landlordId}`),
        api.get(`/units`),
        api.get(`/rentinvoices?landlord_id=${landlordId}`),
        api.get(`/maintenance_requests`)
      ]);

      setProperties(propRes.data);
      setUnits(unitRes.data);
      setInvoices(invRes.data);
      setMaintenance(maintRes.data);

      const userRes = await api.get(`/users/${landlordId}`);
      const userData = userRes.data;
      if (userData.status === "approved" && userData.show_welcome === true) {
        setShowWelcomeModal(true);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to load landlord data", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [landlordId]);

  const handleStartNow = async () => {
    setShowWelcomeModal(false);
    try {
      await api.patch(`/users/${landlordId}`, { show_welcome: false });
    } catch (err) {
      console.error("Failed to mark welcome as seen", err);
    }
    navigate("/landlord/properties/new");
  };

  const handleCloseWelcome = async () => {
    setShowWelcomeModal(false);
    try {
      await api.patch(`/users/${landlordId}`, { show_welcome: false });
    } catch (err) {
      console.error("Failed to mark welcome as seen", err);
    }
  };

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (user.role === "landlord" && user.status !== "approved") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-background p-8 text-center">
          <h1 className="text-2xl font-semibold">Approval Pending</h1>
          <p className="text-muted-foreground">
            Your account is under review. You will be notified once approved.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchData} />;
  }

  const dashboardContent = properties.length === 0 ? (
    <EmptyState
      title="No properties yet"
      description="Add your first property to see metrics and manage units."
    />
  ) : (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Landlord Dashboard</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Properties" value={properties.length} />
        <MetricCard
          label="Occupied Units"
          value={`${units.filter((u: any) => u.status === "occupied").length} / ${units.length}`}
        />
        <MetricCard
          label="Vacant Units"
          value={`${units.length - units.filter((u: any) => u.status === "occupied").length} / ${units.length}`}
        />
        <MetricCard
          label="Rent Collected"
          value={`KES ${invoices
            .filter((inv: any) => inv.status === "paid")
            .reduce((sum: number, inv: any) => sum + inv.invoice_amount, 0)
            .toLocaleString()}`}
        />
        <MetricCard
          label="Outstanding Rent"
          value={`KES ${invoices
            .filter((inv: any) => inv.status === "overdue")
            .reduce((sum: number, inv: any) => sum + inv.invoice_amount, 0)
            .toLocaleString()}`}
        />
        <MetricCard label="Pending Invoices" value={invoices.filter((inv: any) => inv.status === "pending").length} />
        <MetricCard label="Open Maintenance" value={maintenance.filter((m: any) => m.status !== "completed").length} />
      </section>
    </div>
  );

  return (
    <>
      {dashboardContent}

      {/* Welcome Modal – clean and visible */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome to HomeHub!</h2>
              <button
                onClick={handleCloseWelcome}
                className="text-3xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
              Your account has been approved. You can now add properties and manage tenants.
            </p>

            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCloseWelcome}
                className="border border-gray-300 dark:border-gray-600 px-5 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Explore Dashboard
              </button>
              <button
                onClick={handleStartNow}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
              >
                Start Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandlordDashboard;