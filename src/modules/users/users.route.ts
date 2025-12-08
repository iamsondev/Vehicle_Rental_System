import express from "express";
import { userController } from "./users.controller";
import verify from "../../middleware/verify";
import auth from "../../middleware/auth";
const router = express.Router();

router.post("/", userController.createUser);
router.get("/", auth(), userController.getUser);
router.get("/singleuser", auth(), userController.getSingleUser);

export const userRoute = router;
