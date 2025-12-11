import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

export const jwtSecret = config.jwt_secret;
const signUpUser = async (payload: Record<string, unknown>) => {
  let { name, email, password, phone } = payload;
  email = (email as string).toLowerCase();

  if (!password || (password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const role = "customer";
  const hashedPass = await bcrypt.hash(password as string, 12);

  const result = await pool.query(
    `
    INSERT INTO users(name, email, password, phone, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [name, email, hashedPass, phone, role]
  );

  return result;
};

const signinUser = async (email: string, password: string) => {
  email = email.toLowerCase();
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "10d" });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

export const authService = {
  signinUser,
  signUpUser,
};
