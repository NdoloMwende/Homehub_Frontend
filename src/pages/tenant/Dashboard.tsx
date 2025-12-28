import { useEffect, useState } from "react";
import api from "../../services/api";
import MetricCard from "@/components/common/MetricCard";
import { getTenantMaintenanceRequests } from "@/services/maintenance.service";
import { getActiveLeaseForTenant } from "@/services/lease.service";

const TENANT_ID = 3; // mock logged-in tenant

const TenantDashboard = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [lease, setLease] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, maintRes, leaseRes] = await Promise.all([
          api.get(`/rentinvoices?tenant_id=${TENANT_ID}`),
          getTenantMaintenanceRequests(TENANT_ID),
          getActiveLeaseForTenant(TENANT_ID),
        ]);

        setInvoices(invoiceRes.data);
        setMaintenance(maintRes);
        setLease(leaseRes);
      } catch (err) {
        console.error("Failed to load tenant dashboard data", err);
      } finally {
        setLoading(false); // ensures loading ends even on error
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
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