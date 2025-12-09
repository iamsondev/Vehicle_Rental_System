import { pool } from "../../config/db";

const addVehicles = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload as {
    vehicle_name: string;
    type: string;
    registration_number: string;
    daily_rent_price: number;
    availability_status: string;
  };

  const types = ["car", "bike", "van", "suv"];
  if (!types.includes(type)) {
    throw new Error("invalid vehicle type");
  }

  if (daily_rent_price < 0) {
    throw new Error("daily_rent_price must be positive");
  }

  const status = ["available", "booked"];
  if (!status.includes(availability_status)) {
    throw new Error("Invalid availability status");
  }

  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};
export const VehiclesService = {
  addVehicles,
};
