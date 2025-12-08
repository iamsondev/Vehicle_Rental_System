import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

export const jwtSecret = config.jwt_secret;
const signUpUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  if (!password || (password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const hashedPass = await bcrypt.hash(password as string, 12);
  const result = await pool.query(
    `
     INSERT INTO users(name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
    [name, email, hashedPass, phone, role]
  );

  return result;
};
const signinUser = async (email: string, password: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email]
  );
  if (result.rows.length === 0) {
    throw new Error("user not found");
  }
  const userPassword = result.rows[0].password;
  const matchedPassword = await bcrypt.compare(password, userPassword);

  if (!matchedPassword) {
    throw new Error("invalid");
  }

  const jwtPayload = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
    role: result.rows[0].role,
  };

  const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "10d" });

  return { token, result: result.rows[0] };
};

export const authService = {
  signinUser,
  signUpUser,
};
