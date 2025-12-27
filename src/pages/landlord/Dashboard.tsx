import { useEffect, useState } from "react";
import api from "../../services/api";
import MetricCard from "@/components/common/MetricCard";

const LANDLORD_ID = 2;

const LandlordDashboard = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/properties?landlord_id=${LANDLORD_ID}`).then(res =>
      setProperties(res.data)
    );

    api.get(`/units`).then(res =>
      setUnits(res.data)
    );

    api.get(`/rentinvoices?landlord_id=${LANDLORD_ID}`).then(res =>
      setInvoices(res.data)
    );

    api.get(`/maintenance_requests`).then(res =>
      setMaintenance(res.data)
    );
  }, []);

    const totalProperties = properties.length;

  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const vacantUnits = totalUnits - occupiedUnits;

  const totalInvoiced = invoices.reduce(
    (sum, inv) => sum + inv.invoice_amount,
    0
  );

  const totalPaid = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.invoice_amount, 0);

  const outstandingRent = totalInvoiced - totalPaid;

  const openMaintenance = maintenance.filter(
    m => m.status !== "completed"
  ).length;

    return (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-semibold">
      Landlord Dashboard
    </h1>

    {/* Metrics Section */}
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <MetricCard
      label="Total Properties"
      value={totalProperties}
    />
    <MetricCard
      label="Occupied Units"
      value={`${occupiedUnits} / ${totalUnits}`}
    />
    <MetricCard
      label="Vacant Units"
      value={`${vacantUnits} / ${totalUnits}`}
    />
    <MetricCard
      label="Rent Collected"
      value={`KES ${totalPaid.toLocaleString()}`}
    />
    <MetricCard
      label="Outstanding Rent"
      value={`KES ${outstandingRent.toLocaleString()}`}
    />
    <MetricCard
      label="Open Maintenance"
      value={openMaintenance}
    />
  </section>


    {/* Secondary sections (later) */}
  </div>
);

};

export default LandlordDashboard;

