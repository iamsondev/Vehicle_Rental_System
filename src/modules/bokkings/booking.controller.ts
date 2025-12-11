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

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const data = await bookingsService.getBookings(user);

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const status = req.body.status;
    const user = req.user!;

    const updated = await bookingsService.updateBookings(
      bookingId,
      status,
      user
    );

    res.status(200).json({
      success: true,
      message: updated.message,
      data: updated.data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingsController = {
  createBooking,
  getBookings,
  updateBookings,
};
