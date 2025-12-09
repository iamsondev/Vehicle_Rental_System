import express from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";

const router = express.Router();

router.post("/", vehiclesController.addVehicles);
export const vehiclesRouter = router;
