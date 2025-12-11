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
const getSingleVehicle = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.vehicleId!, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
        data: [],
      });
    }

    const vehicle = await vehiclesService.getSingleVehicle(id);

    res.status(200).json({
      success: true,
      message: "Specific vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
      data: [],
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.vehicleId!, 10);

    const updatedVehicle = await vehiclesService.updateVehicle({
      id,
      ...req.body,
    });

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: [],
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete vehicles",
      });
    }

    const id = Number(req.params.vehicleId);

    const deleted = await vehiclesService.deleteVehicle(id);

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      data: deleted,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const vehiclesController = {
  addVehicles,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
