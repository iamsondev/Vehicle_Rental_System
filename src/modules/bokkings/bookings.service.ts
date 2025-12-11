import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicle_id,
  ]);
  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  const vehicle = vehicleResult.rows[0];

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) + 1
  );
  const total_price = days * Number(vehicle.daily_rent_price);

  const bookingResult = await pool.query(
    `
    INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
  `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    ...bookingResult.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getBookings = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query(`
      SELECT * FROM bookings
    `);
    return result.rows;
  } else {
    const result = await pool.query(
      `
      SELECT * FROM bookings WHERE customer_id=$1
    `,
      [user.id]
    );
    return result.rows;
  }
};

const updateBookings = async (
  bookingId: number,
  status: "cancelled" | "returned",
  user: any
) => {
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);
  if (!bookingRes.rows.length) throw new Error("Booking not found");

  const booking = bookingRes.rows[0];

  if (status === "cancelled") {
    if (user.role !== "customer") {
      throw new Error("Only customers can cancel booking");
    }

    if (booking.customer_id !== user.id) {
      throw new Error("You can cancel only your own booking");
    }

    if (new Date() >= new Date(booking.rent_start_date)) {
      throw new Error("You can cancel only before start date");
    }

    const result = await pool.query(
      `UPDATE bookings SET status='cancelled', updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [bookingId]
    );

    return {
      message: "Booking cancelled successfully",
      data: result.rows[0],
    };
  }

  if (status === "returned") {
    if (user.role !== "admin") {
      throw new Error("Only admin can mark booking as returned");
    }

    const result = await pool.query(
      `UPDATE bookings SET status='returned', updated_at=NOW()
       WHERE id=$1 RETURNING *`,
      [bookingId]
    );

    await pool.query(
      `UPDATE vehicles SET availability_status='available'
       WHERE id=$1`,
      [booking.vehicle_id]
    );

    return {
      message: "Booking marked as returned. Vehicle is now available",
      data: {
        ...result.rows[0],
        vehicle: { availability_status: "available" },
      },
    };
  }

  throw new Error("Invalid status");
};

export const bookingsService = {
  createBooking,
  getBookings,
  updateBookings,
};
