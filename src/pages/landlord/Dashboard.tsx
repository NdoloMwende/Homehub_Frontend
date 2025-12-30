import { useEffect, useState } from "react";
import api from "../../services/api";
import MetricCard from "@/components/common/MetricCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { useAuth } from "@/context/AuthContext";

const LandlordDashboard = () => {
  const { user } = useAuth();
  const landlordId = user?.id;  
  const [properties, setProperties] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!landlordId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
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
      } catch (err) {
        console.error("Failed to load landlord data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [landlordId]);

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        title="No properties yet"
        description="Add your first property to see metrics and manage units."
      />
    );
  }

  const totalProperties = properties.length;

  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const vacantUnits = totalUnits - occupiedUnits;

  const paidInvoices = invoices.filter(inv => inv.status === "paid");
  const overdueInvoices = invoices.filter(inv => inv.status === "overdue");
  const pendingInvoices = invoices.filter(inv => inv.status === "pending");

  const totalCollected = paidInvoices.reduce(
    (sum, inv) => sum + inv.invoice_amount,
    0
  );

  const totalOverdue = overdueInvoices.reduce(
    (sum, inv) => sum + inv.invoice_amount,
    0
  );

  const openMaintenance = maintenance.filter(
    m => m.status !== "completed"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Landlord Dashboard</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Properties" value={totalProperties} />
        <MetricCard label="Occupied Units" value={`${occupiedUnits} / ${totalUnits}`} />
        <MetricCard label="Vacant Units" value={`${vacantUnits} / ${totalUnits}`} />
        <MetricCard label="Rent Collected" value={`KES ${totalCollected.toLocaleString()}`} />
        <MetricCard label="Outstanding Rent" value={`KES ${totalOverdue.toLocaleString()}`} />
        <MetricCard label="Pending Invoices" value={pendingInvoices.length} />
        <MetricCard label="Open Maintenance" value={openMaintenance} />
      </section>
    </div>
  );
};

export default LandlordDashboard;