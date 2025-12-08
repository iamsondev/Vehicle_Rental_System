import express from "express";
import { userController } from "./users.controller";
import verify from "../../middleware/verify";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
const router = express.Router();

router.post("/", userController.createUser);
router.get("/", auth(Roles.admin), userController.getUser);
router.get("/singleuser", auth(Roles.customer), userController.getSingleUser);

export const userRoute = router;
