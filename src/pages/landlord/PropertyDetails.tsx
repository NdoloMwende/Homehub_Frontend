import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { type Property } from "../../types/property";
import { type Unit } from "../../types/unit";
import { type Lease } from "../../types/lease";
import { type User } from "../../types/user";

import {
  getPropertyById,
  getUnitsByProperty
} from "../../services/property.service";

import {
  getLeaseByUnit,
  getTenantById
} from "../../services/lease.service";

type UnitLeaseInfo = {
  tenantName: string;
  leaseStatus: string;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const propertyId = Number(id);

  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitLeases, setUnitLeases] = useState<Record<number, UnitLeaseInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch property + units
        const [propertyData, unitData] = await Promise.all([
          getPropertyById(propertyId),
          getUnitsByProperty(propertyId)
        ]);

        setProperty(propertyData);
        setUnits(unitData);

        // 2Fetch active lease + tenant per unit
        const leaseMap: Record<number, UnitLeaseInfo> = {};

        for (const unit of unitData) {
          const leases: Lease[] = await getLeaseByUnit(unit.id);

          if (leases.length > 0) {
            const activeLease = leases[0];
            const tenant: User = await getTenantById(activeLease.tenant_id);

            leaseMap[unit.id] = {
              tenantName: tenant.full_name,
              leaseStatus: activeLease.status
            };
          }
        }

        setUnitLeases(leaseMap);
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

  // Metrics
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
        {units.map(unit => {
          const leaseInfo = unitLeases[unit.id];

          return (
            <li key={unit.id}>
              <strong>Unit {unit.unit_number}</strong> — {unit.status} — KES{" "}
              {unit.rent_amount}
              <br />
              {leaseInfo ? (
                <>
                  Tenant: {leaseInfo.tenantName} | Lease:{" "}
                  {leaseInfo.leaseStatus}
                </>
              ) : (
                "No active lease"
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PropertyDetails;
