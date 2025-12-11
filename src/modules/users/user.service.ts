import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  const hashedPass = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    `
     INSERT INTO users(name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
    [name, email, hashedPass, phone, role]
  );
  return result;
};

const getUser = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone, role FROM users
  `);
  return result.rows;
};
const getSingleUser = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

const updateUser = async (
  name: string,
  email: string,
  role: string,
  id: string
) => {
  const result = await pool.query(
    `
    UPDATE users set name=$1, email=$2, role=$3 WHERE id=$4 RETURNING *
    `,
    [name, email, role, id]
  );

  return result;
};

const deleteUser = async (userId: string) => {
  const bookingCheck = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [userId]
  );

  if (bookingCheck.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  await pool.query(`DELETE FROM users WHERE id=$1`, [userId]);

  return true;
};
export const userService = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
