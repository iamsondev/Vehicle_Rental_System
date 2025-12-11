import express from "express";
import { userController } from "./users.controller";
import verify from "../../middleware/verify";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
const router = express.Router();

router.post("/", userController.createUser);
router.get("/", auth(Roles.admin), userController.getUser);
router.get(
  "/:userId",
  auth(Roles.customer, Roles.admin),
  userController.getSingleUser
);
router.put(
  "/:userId",
  auth(Roles.admin, Roles.customer),
  userController.updateUser
);
router.delete("/:userId", auth(Roles.admin), userController.deleteUser);

export const userRoute = router;
