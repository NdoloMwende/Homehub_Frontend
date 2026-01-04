import { useEffect, useState } from "react";
import {
  getUserNotifications,
  markNotificationRead
} from "@/services/notification.service";
import { type Notification } from "@/types/notification";
import { useAuth } from "@/context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications(user.id);
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleMarkRead = async (id: number) => {
    await markNotificationRead(id);

    if (!user) return;

    const updated = await getUserNotifications(user.id);
    setNotifications(updated);
  };

  if (!user) {
    return <p>Please log in to view notifications.</p>;
  }

  if (loading) {
    return <p>Loading notifications...</p>;
  }

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
