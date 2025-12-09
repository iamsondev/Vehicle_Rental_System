import { Result } from "pg";
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

const getVehicles = async () => {
  const result = await pool.query(`
    SELECT * FROM vehicles
    `);
  return result.rows;
};

const getSingleVehicle = async (id: number) => {
  const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  return result.rows[0];
};

const updateVehicle = async (payload: any) => {
  const { id, vehicle_name, type, daily_rent_price, availability_status } =
    payload;

  const result = await pool.query(
    `
    UPDATE vehicles
    SET
      vehicle_name = $1,
      type = $2,
      daily_rent_price = $3,
      availability_status = $4,
      updated_at = NOW()
    WHERE id = $5
    RETURNING *;
    `,
    [vehicle_name, type, daily_rent_price, availability_status, id]
  );

  return result.rows[0];
};

export const vehiclesService = {
  addVehicles,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
};
