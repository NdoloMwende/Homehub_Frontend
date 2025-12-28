import { useEffect, useState } from "react";
import api from "../../services/api";
import MetricCard from "@/components/common/MetricCard";

const TENANT_ID = 3; // mock logged-in tenant

const TenantDashboard = () => {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    api
      .get(`/rentinvoices?tenant_id=${TENANT_ID}`)
      .then(res => setInvoices(res.data))
      .catch(err => {
        console.error("Failed to load tenant invoices", err);
      });
  }, []);

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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Tenant Dashboard
      </h1>

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
      </section>
    </div>
  );
};

export default TenantDashboard;
