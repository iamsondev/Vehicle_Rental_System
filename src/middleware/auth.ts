import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { jwtSecret } from "../modules/auth/auth.service";
import { pool } from "../config/db";

const auth = (...roles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(401).json({});
    }
    const bearer = authorization.split(" ");
    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return res.status(401).json({ message: "invalid authorization format" });
    }

    const token = bearer[1];

    const decoded = jwt.verify(token as string, jwtSecret) as JwtPayload;
    console.log(decoded);
    const result = await pool.query(
      `
      SELECT * FROM users WHERE email=$1
      `,
      [decoded.email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = decoded;
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }
    next();
  };
};

export default auth;
