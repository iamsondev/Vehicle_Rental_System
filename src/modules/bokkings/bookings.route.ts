import { Router } from "express";
import { bookingsController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";

const router = Router();
router.post(
  "/",
  auth(Roles.admin, Roles.customer),
  bookingsController.createBooking
);

export const bookingsRouter = router;
