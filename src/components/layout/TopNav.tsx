import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/services/api";

const TopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();  // ← for active state
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

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
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Public nav
  if (!user) {
    return (
      <header className="w-full border-b bg-background">
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/" className="text-xl font-semibold">
            HomeHub
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              to="/"
              className={isActive("/") ? "font-medium" : "hover:underline"}
            >
              Home
            </Link>
            <Link
              to="/demo"
              className={isActive("/demo") ? "font-medium" : "hover:underline"}
            >
              Demo
            </Link>
            <Link
              to="/contact"
              className={isActive("/contact") ? "font-medium" : "hover:underline"}
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="rounded-md border px-4 py-2 hover:bg-muted transition"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>
    );
  }

  // Authenticated nav
  const dashboardPath =
    user.role === "admin"
      ? "/admin"
      : user.role === "landlord"
      ? "/landlord"
      : "/tenant";

  return (
    <header className="w-full border-b bg-background">
      <div className="flex items-center justify-between px-6 py-3">
        <Link to="/" className="text-xl font-semibold">
          HomeHub
        </Link>

        <nav className="flex items-center gap-8 text-sm">
          <Link
            to={dashboardPath + "/dashboard"}
            className={
              isActive(dashboardPath) ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground transition"
            }
          >
            Dashboard
          </Link>

          <button
            onClick={() => navigate("/notifications")}
            className="relative text-muted-foreground hover:text-foreground transition"
          >
            <span className={isActive("/notifications") ? "font-medium" : ""}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <span className="text-muted-foreground capitalize">
            {user.role}
          </span>

          <button
            onClick={handleLogout}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default TopNav;