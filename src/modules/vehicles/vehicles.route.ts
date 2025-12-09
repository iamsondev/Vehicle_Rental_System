import express from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";

const router = express.Router();

router.post("/", auth(Roles.admin), vehiclesController.addVehicles);
router.get("/", vehiclesController.getVehicles);
router.get("/:vehicleId", vehiclesController.getSingleVehicle);
router.put("/:vehicleId", auth(Roles.admin), vehiclesController.updateVehicle);
export const vehiclesRouter = router;
