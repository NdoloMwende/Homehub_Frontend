import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/api";
import StatusBadge from "@/components/common/StatusBadge";
import { type RentInvoice } from "@/types/rentinvoice";

interface PaymentRecord {
  due_date: string;
  payment_reference: string;
  payment_method: string;
}

const PaymentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<RentInvoice | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invoiceRes = await api.get<RentInvoice>(`/rentinvoices/${id}`);
        setInvoice(invoiceRes.data);

        // If invoice is paid, fetch related payment for due_date and reference
        if (invoiceRes.data.payment_id) {
          const paymentRes = await api.get<PaymentRecord>(
            `/payments/${invoiceRes.data.payment_id}`
          );
          setPayment(paymentRes.data);
        }
      } catch (err) {
        console.error("Failed to load invoice details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Loading invoice...</p>;

  if (!invoice) return <p className="p-6">Invoice not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Link to="/tenant/payments" className="text-sm hover:underline">
        ← Back to Payments
      </Link>

      <h1 className="text-2xl font-semibold">Invoice #{invoice.id}</h1>

      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-3xl font-bold">
            KES {invoice.invoice_amount.toLocaleString()}
          </p>
          <StatusBadge status={invoice.status} />
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Invoice Date</dt>
            <dd>{new Date(invoice.invoice_date).toLocaleDateString()}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground">Due Date</dt>
            <dd>
              {payment?.due_date
                ? new Date(payment.due_date).toLocaleDateString()
                : "Not available"}
            </dd>
          </div>

          {invoice.paid_date && (
            <>
              <div>
                <dt className="text-muted-foreground">Paid Date</dt>
                <dd>{new Date(invoice.paid_date).toLocaleDateString()}</dd>
              </div>

              <div>
                <dt className="text-muted-foreground">Payment Reference</dt>
                <dd>{payment?.payment_reference || "N/A"}</dd>
              </div>

              <div>
                <dt className="text-muted-foreground">Payment Method</dt>
                <dd>{payment?.payment_method || "N/A"}</dd>
              </div>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default PaymentDetails;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getInvoiceById } from "@/services/payment.service";
// import { type RentInvoice } from "@/types/rentinvoice";
// import StatusBadge from "@/components/common/StatusBadge";

// const PaymentDetails = () => {
//   const { invoiceId } = useParams();
//   const id = Number(invoiceId);

//   const [invoice, setInvoice] = useState<RentInvoice | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         const data = await getInvoiceById(id);
//         setInvoice(data);
//       } catch (err) {
//         console.error("Failed to load invoice details", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!isNaN(id)) {
//       fetchInvoice();
//     }
//   }, [id]);

//   if (loading) return <p>Loading invoice...</p>;
//   if (!invoice) return <p>Invoice not found</p>;

//   const today = new Date();
//   const invoiceDate = new Date(invoice.invoice_date);

//   const computedStatus =
//     invoice.status === "paid"
//       ? "paid"
//       : invoiceDate < today
//       ? "overdue"
//       : "pending";

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-semibold">
//         Invoice #{invoice.id}
//       </h1>

//       <div className="border rounded p-4 space-y-2">
//         <p>
//           <strong>Amount:</strong> KES{" "}
//           {invoice.invoice_amount.toLocaleString()}
//         </p>

//         <p>
//           <strong>Invoice Date:</strong> {invoice.invoice_date}
//         </p>

//         <p className="capitalize">
//           <strong>Status:</strong> {computedStatus}
//         </p>

//         {invoice.paid_date && (
//           <p>
//             <strong>Paid On:</strong> {invoice.paid_date}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentDetails;
// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import api from "@/services/api";
// import StatusBadge from "@/components/common/StatusBadge";
// import { type RentInvoice  } from "@/types/rentinvoice";


// const PaymentDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const [invoice, setInvoice] = useState<RentInvoice | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchInvoice = async () => {
//       try {
//         const res = await api.get(`/rentinvoices/${id}`);
//         setInvoice(res.data);
//       } catch (err) {
//         console.error("Failed to load invoice details", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoice();
//   }, [id]);

//   if (loading) return <p className="p-6">Loading invoice...</p>;

//   if (!invoice) return <p className="p-6">Invoice not found</p>;

//   return (
//     <div className="p-6 max-w-2xl mx-auto space-y-6">
//       <Link to="/tenant/payments" className="text-sm hover:underline">
//         ← Back to Payments
//       </Link>

//       <h1 className="text-2xl font-semibold">Invoice #{invoice.id}</h1>

//       <div className="border rounded-lg p-6 space-y-4">
//         <div className="flex justify-between items-center">
//           <p className="text-3xl font-bold">
//             KES {invoice.invoice_amount.toLocaleString()}
//           </p>
//           <StatusBadge status={invoice.status} />
//         </div>

//         <dl className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <dt className="text-muted-foreground">Invoice Date</dt>
//             <dd>{new Date(invoice.invoice_date).toLocaleDateString()}</dd>
//           </div>
//           <div>
//             <dt className="text-muted-foreground">Invoice Date</dt>
//             <dd>{new Date(invoice.invoice_date).toLocaleDateString()}</dd>
//           </div>
//           {invoice.paid_date && (
//             <>
//               <div>
//                 <dt className="text-muted-foreground">Paid Date</dt>
//                 <dd>{new Date(invoice.paid_date).toLocaleDateString()}</dd>
//               </div>
           
//             </>
//           )}
//         </dl>
//       </div>
//     </div>
//   );
// };

// export default PaymentDetails;