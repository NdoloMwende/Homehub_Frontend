export interface RentInvoice {
  id: number;
  unit_id: number;
  landlord_id: number;
  tenant_id: number;
  lease_id: number;
  invoice_date: string;
  invoice_amount: number;
  status: "pending" | "paid" | "overdue";
  paid_date?: string;
  payment_id?: number;
  created_at: string;
  updated_at: string;
}
