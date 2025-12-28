import { useEffect, useState } from "react";
import { getTenantInvoices } from "@/services/payment.service";
import {type RentInvoice } from "@/types/rentinvoice";
import MetricCard from "@/components/common/MetricCard";

const TENANT_ID = 3;

const TenantPayments = () => {
  const [invoices, setInvoices] = useState<RentInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getTenantInvoices(TENANT_ID);
        setInvoices(data);
      } catch (err) {
        console.error("Failed to load invoices", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) return <p>Loading payments...</p>;

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
                className="border rounded p-3 flex justify-between"
              >
                <div>
                  <p>Invoice #{inv.id}</p>
                  <p className="text-sm text-gray-500">
                    Due: {inv.invoice_date}
                  </p>
                </div>

                <div className="text-right">
                  <p>KES {inv.invoice_amount.toLocaleString()}</p>
                  <p className="text-sm capitalize">{inv.status}</p>
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
