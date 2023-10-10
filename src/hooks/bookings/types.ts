import { Tables } from "@/database.extensions";

export type Booking = Tables<"bookings"> & {
  activity: Tables<"activities">;
};

export type BookingsParams = {
  per?: number;
  page?: number;
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
