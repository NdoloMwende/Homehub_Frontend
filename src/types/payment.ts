export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  due_date: string;
  paid_date?: string;
  payment_reference: string;
  status: "pending" | "paid" | "overdue";
  payment_method: string;
  created_at: string;
  updated_at: string;
}
