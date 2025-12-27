import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { type Property } from "../../types/property";
import { type Unit } from "../../types/unit";
import {
  getPropertyById,
  getUnitsByProperty
} from "../../services/property.service";

const PropertyDetails = () => {
  const { id } = useParams();
  const propertyId = Number(id);

  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [propertyData, unitData] = await Promise.all([
          getPropertyById(propertyId),
          getUnitsByProperty(propertyId)
        ]);

        setProperty(propertyData);
        setUnits(unitData);
      } catch (err) {
        console.error("Failed to load property details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [propertyId]);

  if (loading) return <p>Loading property...</p>;
  if (!property) return <p>Property not found</p>;

  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === "occupied").length;
  const occupancyRate =
    totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  return (
    <div>
      <h1>{property.name}</h1>
      <p>{property.address}</p>

      <h3>Overview</h3>
      <ul>
        <li>Total Units: {totalUnits}</li>
        <li>Occupied Units: {occupiedUnits}</li>
        <li>Occupancy Rate: {occupancyRate}%</li>
      </ul>

      <h3>Units</h3>
      <ul>
        {units.map(unit => (
          <li key={unit.id}>
            Unit {unit.unit_number} — {unit.status} — KES {unit.rent_amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyDetails;
