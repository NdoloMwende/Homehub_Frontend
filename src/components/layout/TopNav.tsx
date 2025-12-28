import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/services/api";

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const res = await api.get(
          `/notifications?recipient_user_id=${user.id}&is_read=false`
        );
        setUnreadCount(res.data.length);
      } catch (err) {
        console.error("Failed to load unread count", err);
      }
    };

    fetchUnread();
    // Optional: poll every 30s — remove if not needed
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Public nav (no user)
  if (!user) {
    return (
      <header className="w-full border-b bg-background">
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/" className="text-xl font-semibold">
            HomeHub
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/demo" className="hover:underline">
              Demo
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
            <Link
              to="/login"
              className="rounded-md border px-3 py-1 hover:bg-muted"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  // Authenticated nav
  return (
    <header className="w-full border-b bg-background">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="text-xl font-semibold">
          HomeHub
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {/* Role-specific dashboard link */}
          <Link
            to={
              user.role === "admin"
                ? "/admin/dashboard"
                : user.role === "landlord"
                ? "/landlord/dashboard"
                : "/tenant/dashboard"
            }
            className="hover:underline"
          >
            Dashboard
          </Link>

          {/* Notifications bell */}
          <button
            onClick={() => navigate("/notifications")}
            className="relative hover:underline"
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-3 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role label */}
          <span className="capitalize text-muted-foreground">
            {user.role}
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-md border px-3 py-1 hover:bg-muted"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default TopNav;