import { Request, Response } from "express";
import { VehiclesService } from "./vehicles.service";

const addVehicles = async (req: Request, res: Response) => {
  try {
    const result = await VehiclesService.addVehicles(req.body);
    res.status(201).json({
      success: true,
      message: "add vehicles successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehiclesController = {
  addVehicles,
};
