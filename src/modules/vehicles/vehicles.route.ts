import express from "express";
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";

const router = express.Router();

router.post("/", auth(Roles.admin), vehiclesController.addVehicles);
router.get("/", vehiclesController.getVehicles);
export const vehiclesRouter = router;
