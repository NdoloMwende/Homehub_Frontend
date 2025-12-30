import { useEffect, useState } from "react";
import api from "../../services/api";
import MetricCard from "@/components/common/MetricCard";
import { getTenantMaintenanceRequests } from "@/services/maintenance.service";
import { getActiveLeaseForTenant } from "@/services/lease.service";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";
import { useAuth } from "@/context/AuthContext";
import ErrorMessage from "@/components/common/ErrorMessage";
// const TENANT_ID = 3; // mock logged-in tenant

const TenantDashboard = () => {
  const {user} = useAuth();
  const tenantId = user?.id;

  const [invoices, setInvoices] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [lease, setLease] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    try {
      const [invoiceRes, maintRes, leaseRes] = await Promise.all([
        api.get(`/rentinvoices?tenant_id=${tenantId}`),
        getTenantMaintenanceRequests(tenantId),
        getActiveLeaseForTenant(tenantId),
      ]);

      setInvoices(invoiceRes.data);
      setMaintenance(maintRes);
      setLease(leaseRes);
      setError(null); // clear any previous error
    } catch (err) {
      console.error("Failed to load tenant dashboard data", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenantId]);
  
 useEffect(() => {
    fetchData();
  }, [tenantId]);


  // Invoice calculations
  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + inv.invoice_amount,
    0
  );

  const paidInvoices = invoices.filter(inv => inv.status === "paid");
  const pendingInvoices = invoices.filter(inv => inv.status === "pending");
  const overdueInvoices = invoices.filter(inv => inv.status === "overdue");

  const totalPaid = paidInvoices.reduce(
    (sum, inv) => sum + inv.invoice_amount,
    0
  );

  const totalOutstanding = pendingInvoices
    .concat(overdueInvoices)
    .reduce((sum, inv) => sum + inv.invoice_amount, 0);


  const openMaintenance = maintenance.filter(
    m => m.status !== "completed"
  ).length;

  const leaseExpiry = lease
    ? new Date(lease.end_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No active lease";

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }
  if (error) {
  return <ErrorMessage message={error} onRetry={fetchData} />;
}

  if (invoices.length === 0 && maintenance.length === 0 && !lease) {
    return (
      <EmptyState
        title="Welcome to your dashboard"
        description="Once you have invoices, maintenance requests, or an active lease, they will appear here."
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Tenant Dashboard</h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Invoiced"
          value={`KES ${totalInvoiced.toLocaleString()}`}
        />
        <MetricCard
          label="Paid"
          value={`KES ${totalPaid.toLocaleString()}`}
        />
        <MetricCard
          label="Outstanding"
          value={`KES ${totalOutstanding.toLocaleString()}`}
        />
        <MetricCard
          label="Overdue Invoices"
          value={overdueInvoices.length}
        />
        <MetricCard label="Open Maintenance" value={openMaintenance} />
        <MetricCard label="Lease Expiry" value={leaseExpiry} />
      </section>
    </div>
  );
};

export default TenantDashboard;