import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const addVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehiclesService.addVehicles(req.body);
    res.status(201).json({
      success: true,
      message: "add vehicles successfully",
      data: vehicles,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehiclesService.getVehicles();
    res.status(200).json({
      success: true,
      message: "all vehicles here",
      data: vehicles,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehiclesController = {
  addVehicles,
  getVehicles,
};
