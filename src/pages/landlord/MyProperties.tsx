import { useEffect, useState } from "react";
import { getLandlordProperties } from "../../services/property.service";
import { type Property } from "../../types/property";

const MyProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // TEMP: mock logged-in landlord
  const landlordId = 2;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getLandlordProperties(landlordId);
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <p>Loading properties...</p>;

  if (properties.length === 0) {
    return <p>No properties found.</p>;
  }

  return (
    <div>
      <h1>My Properties</h1>

      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <strong>{property.name}</strong>
            <div>{property.address}</div>
            <div>Status: {property.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProperties;
