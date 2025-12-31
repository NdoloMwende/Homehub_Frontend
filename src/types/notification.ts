export interface Notification {
  id: number;
  recipient_user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}