// // router.tsx
// import { Routes, Route } from "react-router-dom";

// // public
// import Landing from "@/pages/public/Landing";

// // auth
// import Login from "@/pages/auth/Login";

// // admin
// import AdminDashboard from "@/pages/admin/Dashboard";

// // landlord
// import LandlordDashboard from "@/pages/landlord/Dashboard";

// // tenant
// import TenantDashboard from "@/pages/tenant/Dashboard";

// export default function Router() {
//   return (
//     <Routes>
//       <Route path="/" element={<Landing />} />
//       <Route path="/login" element={<Login />} />

//       <Route path="/admin/dashboard" element={<AdminDashboard />} />
//       <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
//       <Route path="/tenant/dashboard" element={<TenantDashboard />} />
//     </Routes>
//   );
// }

import { Routes, Route } from "react-router-dom";

// Public pages
import Landing from "./pages/public/Landing";

// Auth pages
import Login from "./pages/auth/Login";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Router;

