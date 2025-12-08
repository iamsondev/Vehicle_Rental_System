import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

export const jwtSecret = config.jwt_secret;
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
  };

  const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: "10d" });

  return { token, result: result.rows[0] };
};

export const authService = {
  signinUser,
};
