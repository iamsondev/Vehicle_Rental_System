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
    SELECT id,name,email,phone,created_at,updated_at FROM users
    `);
  return result;
};
const getSingleUser = async (email: string) => {
  const result = await pool.query(
    `
    SELECT id,name,email,phone,created_at,updated_at FROM users WHERE email=$1
    `,
    [email]
  );
  return result;
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
export const userService = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
};
