import { json, Request, Response } from "express";
import { authService } from "./auth.service";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUpUser(req.body);
    res.status(200).json({
      success: true,
      message: "user created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const signinUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.signinUser(
      req.body.email,
      req.body.password
    );
    res.status(200).json({
      success: true,
      message: "signed in successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  signinUser,
  signUpUser,
};
