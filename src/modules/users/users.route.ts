import express from "express";
import { userController } from "./users.controller";
import verify from "../../middleware/verify";
const router = express.Router();

router.post("/", verify, userController.createUser);
router.get("/", userController.getUser);

export const userRoute = router;
