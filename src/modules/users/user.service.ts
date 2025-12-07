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
    SELECT * FROM users
    `);
  return result;
};
export const userService = {
  createUser,
  getUser,
};
