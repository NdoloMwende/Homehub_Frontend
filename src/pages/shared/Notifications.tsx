import { useEffect, useState } from "react";
import {
  getUserNotifications,
  markNotificationRead
} from "@/services/notification.service";
import { type Notification } from "@/types/notification";

const MOCK_USER_ID = 3; // temporary — will be replaced with real auth context

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await getUserNotifications(MOCK_USER_ID);
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: number) => {
    await markNotificationRead(id);
    fetchNotifications();
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications at this time.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(notif => (
            <li
              key={notif.id}
              className={`border p-4 rounded ${
                notif.is_read ? "opacity-70" : "bg-blue-50"
              }`}
            >
              <p className={notif.is_read ? "" : "font-medium"}>
                {notif.message}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(notif.created_at).toLocaleString()}
              </p>

              {!notif.is_read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="text-sm underline mt-2"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;