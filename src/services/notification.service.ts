import api from "./api";
import {  type Notification } from "@/types/notification";

export const getUserNotifications = async (
  userId: number
): Promise<Notification[]> => {
  const res = await api.get(
    `/notifications?recipient_user_id=${userId}&_sort=created_at:DESC`
  );
  return res.data;
};

export const markNotificationRead = async (id: number) => {
  return api.patch(`/notifications/${id}`, { is_read: true });
};

export const createNotification = async (
  recipientId: number,
  message: string,
  senderId?: number
) => {
  return api.post("/notifications", {
    recipient_user_id: recipientId,
    user_id: senderId || null,
    message,
    is_read: false,
    created_at: new Date().toISOString(),
  });
};