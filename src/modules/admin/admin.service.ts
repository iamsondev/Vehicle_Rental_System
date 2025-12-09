import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const createAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  const { name, email, password, phone } = payload;

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `INSERT INTO users(name,email,password,phone,role)
     VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [name, email.toLowerCase(), hashedPassword, phone, "admin"]
  );

  return result.rows[0];
};

export const adminService = {
  createAdmin,
};
