// export default function LandlordDashboard() {
//     return (
//         <div>
//             <h1>Landlord Dashboard</h1>
//             <p>Manage your properties and view analytics.</p>
//         </div>
//     );
// }
import { useEffect, useState } from "react";
import {
  getLandlordProperties,
  getLandlordInvoices
} from "../../services/landlord.service";

const LANDLORD_ID = 2; // mock logged-in landlord

const LandlordDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    getLandlordProperties(LANDLORD_ID).then(res =>
      setProperties(res.data)
    );

    getLandlordInvoices(LANDLORD_ID).then(res =>
      setInvoices(res.data)
    );
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Landlord Dashboard (Data Test)</h1>

      <h2>Properties</h2>
      <pre>{JSON.stringify(properties, null, 2)}</pre>

      <h2>Invoices</h2>
      <pre>{JSON.stringify(invoices, null, 2)}</pre>
    </div>
  );
};

export default LandlordDashboard;
