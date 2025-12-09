import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";

const router = Router();
router.post("/", auth(Roles.admin), adminController.createAdmin);
export const adminRouter = router;
