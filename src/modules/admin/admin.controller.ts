import { Request, Response } from "express";
import { adminService } from "./admin.service";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await adminService.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: "admin created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const adminController = {
  createAdmin,
};
