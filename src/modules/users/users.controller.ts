import { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
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

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUser();
    res.status(201).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userController = {
  createUser,
  getUser,
};
