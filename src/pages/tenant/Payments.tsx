import { useEffect, useState } from "react";
import { getTenantInvoices } from "@/services/payment.service";
import {type RentInvoice } from "@/types/rentinvoice";
import MetricCard from "@/components/common/MetricCard";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/common/StatusBadge";


const TenantPayments = () => {
  const { user } = useAuth();
   const navigate = useNavigate();

  const tenantId = user?.id;

  const [invoices, setInvoices] = useState<RentInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!tenantId) {
    setLoading(false);
    return;
  }

  const fetchInvoices = async () => {
    try {
      const data = await getTenantInvoices(tenantId);
      setInvoices(data);
    } catch (err) {
      console.error("Failed to load invoices", err);
    } finally {
      setLoading(false);
    }
  };

  fetchInvoices();
}, [tenantId]);

  if (!user) {
    return <p>Please log in to view your payments.</p>;
  }

  if (loading){ return <p>Loading payments...</p>;}

  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + inv.invoice_amount,
    0
  );

  const totalPaid = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.invoice_amount, 0);

  const outstanding = totalInvoiced - totalPaid;
 

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Payments</h1>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Invoiced"
          value={`KES ${totalInvoiced.toLocaleString()}`}
        />
        <MetricCard
          label="Total Paid"
          value={`KES ${totalPaid.toLocaleString()}`}
        />
        <MetricCard
          label="Outstanding"
          value={`KES ${outstanding.toLocaleString()}`}
        />
      </section>

      {/* Invoice List */}
      <section>
        <h2 className="text-lg font-medium mb-2">Invoices</h2>

        {invoices.length === 0 ? (
          <p>No invoices found</p>
        ) : (
          <ul className="space-y-2">
            {invoices.map(inv => (
              <li
  key={inv.id}
  onClick={() => navigate(`/tenant/payments/${inv.id}`)}
  className="border rounded p-3 flex justify-between cursor-pointer hover:bg-muted"
>

                <div>
                  <p>Invoice #{inv.id}</p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(inv.invoice_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p>KES {inv.invoice_amount.toLocaleString()}</p>
                  <StatusBadge status={inv.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TenantPayments;
