import { Tables } from "@/database.extensions";

export type Booking = Tables<"bookings"> & {
  activity: Tables<"activities">;
};

export type BookingsParams = {
  per?: number;
  page?: number;
  from?: Date;
  status?: ("confirmed" | "pending" | "cancelled")[];
};

export type BookingResponse = {
  data: {
    booking: Booking;
  };
};

export type BookingsResponse = {
  data: {
    bookings: Booking[];
  };
};
