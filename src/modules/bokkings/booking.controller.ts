import { Request, Response } from "express";
import { bookingsService } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body };

    if (req.user?.role === "customer") {
      payload.customer_id = req.user.id;
    }

    const booking = await bookingsService.createBooking(payload);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingsController = {
  createBooking,
};
