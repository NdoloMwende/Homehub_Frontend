import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "@/services/payment.service";
import { type RentInvoice } from "@/types/rentinvoice";

const PaymentDetails = () => {
  const { invoiceId } = useParams();
  const id = Number(invoiceId);

  const [invoice, setInvoice] = useState<RentInvoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceById(id);
        setInvoice(data);
      } catch (err) {
        console.error("Failed to load invoice", err);
      } finally {
        setLoading(false);
      }
    };

    if (!isNaN(id)) {
      fetchInvoice();
    }
  }, [id]);

  if (loading) return <p>Loading invoice...</p>;
  if (!invoice) return <p>Invoice not found</p>;

  const today = new Date();
  const invoiceDate = new Date(invoice.invoice_date);

  const computedStatus =
    invoice.status === "paid"
      ? "paid"
      : invoiceDate < today
      ? "overdue"
      : "pending";

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">
        Invoice #{invoice.id}
      </h1>

      <div className="border rounded p-4 space-y-2">
        <p>
          <strong>Amount:</strong> KES{" "}
          {invoice.invoice_amount.toLocaleString()}
        </p>

        <p>
          <strong>Invoice Date:</strong> {invoice.invoice_date}
        </p>

        <p className="capitalize">
          <strong>Status:</strong> {computedStatus}
        </p>

        {invoice.paid_date && (
          <p>
            <strong>Paid On:</strong> {invoice.paid_date}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
