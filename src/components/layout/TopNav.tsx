import { Link } from "react-router-dom";

const TopNav = () => {
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
};

export default TopNav;
