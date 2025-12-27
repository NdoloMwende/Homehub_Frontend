import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import Footer from "./Footer";

type AppShellProps = {
  showFooter?: boolean;
};

const AppShell = ({ showFooter = false }: AppShellProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />

      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default AppShell;
