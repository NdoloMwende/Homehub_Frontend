// export default function Login() {
//     return (
//         <div>
//             <h1>Login Page</h1>
//             <p>This is the login page for authenticated users.</p>
//         </div>
//     );
// }
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() =>
          login({
            id: "1",
            email: "admin@homehub.com",
            role: "admin",
          })
        }
      >
        Login as Admin
      </button>

      <button
        onClick={() =>
          login({
            id: "2",
            email: "landlord@homehub.com",
            role: "landlord",
            approved: true,
          })
        }
      >
        Login as Approved Landlord
      </button>

      <button
        onClick={() =>
          login({
            id: "3",
            email: "tenant@homehub.com",
            role: "tenant",
          })
        }
      >
        Login as Tenant
      </button>
    </div>
  );
};

export default Login;
