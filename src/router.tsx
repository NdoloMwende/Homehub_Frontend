import { Routes, Route } from "react-router-dom";

/* Layout */
import AppShell from "./components/layout/AppShell";
import ProtectedRoute from "./components/common/ProtectedRoute";

/* Public */
import Landing from "./pages/public/Landing";
import DemoWalkthrough from "./pages/public/DemoWalkthrough";
import Contact from "./pages/public/Contact";
import TermsandConditions from "./pages/public/TermsandConditions";

/* Auth */
import Login from "./pages/auth/Login";
import RegisterLandlord from "./pages/auth/RegisterLandlord";
import RegisterTenant from "./pages/auth/RegisterTenant";
import VerifyEmail from "./pages/auth/VerifyEmail";

/* Admin */
import AdminDashboard from "./pages/admin/Dashboard";
import LandlordApprovals from "./pages/admin/LandlordApprovals";
import PropertyVerification from "./pages/admin/PropertyVerification";
import Reports from "./pages/admin/Reports";

/* Landlord */
import LandlordDashboard from "./pages/landlord/Dashboard";
import MyProperties from "./pages/landlord/MyProperties";
import AddProperty from "./pages/landlord/AddProperty";
import PropertyDetails from "./pages/landlord/PropertyDetails";
import UploadDocuments from "./pages/landlord/UploadDocuments";
import MaintenanceInbox from "./pages/landlord/MaintenanceInbox";
import Analytics from "./pages/landlord/Analytics";

/* Tenant */
import TenantDashboard from "./pages/tenant/Dashboard";
import MyPremises from "./pages/tenant/MyPremises";
import MaintenanceRequests from "./pages/tenant/MaintenanceRequests";
import Payments from "./pages/tenant/Payments";
import Documents from "./pages/tenant/Documents";

const Router = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route element={<AppShell showFooter />}>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<DemoWalkthrough />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms-and-conditions" element={<TermsandConditions />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register/landlord" element={<RegisterLandlord />} />
      <Route path="/register/tenant" element={<RegisterTenant />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ================= ADMIN ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/landlords" element={<LandlordApprovals />} />
        <Route path="/admin/properties" element={<PropertyVerification />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Route>

      {/* ================= LANDLORD ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["landlord"]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/landlord/dashboard" element={<LandlordDashboard />} />
        <Route path="/landlord/properties" element={<MyProperties />} />
        <Route path="/landlord/properties/new" element={<AddProperty />} />
        <Route path="/landlord/properties/:id" element={<PropertyDetails />} />
        <Route path="/landlord/documents" element={<UploadDocuments />} />
        <Route path="/landlord/maintenance" element={<MaintenanceInbox />} />
        <Route path="/landlord/analytics" element={<Analytics />} />
      </Route>

      {/* ================= TENANT ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["tenant"]}>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/tenant/dashboard" element={<TenantDashboard />} />
        <Route path="/tenant/premises" element={<MyPremises />} />
        <Route path="/tenant/maintenance" element={<MaintenanceRequests />} />
        <Route path="/tenant/payments" element={<Payments />} />
        <Route path="/tenant/documents" element={<Documents />} />
      </Route>
    </Routes>
  );
};

export default Router;
