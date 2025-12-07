import express from "express";
import { userController } from "./users.controller";
const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.getUser);

export const userRoute = router;
