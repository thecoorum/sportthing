import useSWR, { Fetcher } from "swr";

import { useApi } from "../useApi";

import type {
  Booking,
  BookingsParams,
  BookingResponse,
  BookingsResponse,
} from "./types";

export const useBookings = (params: BookingsParams = {}) => {
  const api = useApi();

  const fetcher: Fetcher<Booking[], string> = (url) =>
    api
      .get(url, { params })
      .then((response: BookingsResponse) => response.data.bookings);

  const { data, error, isLoading } = useSWR("/bookings", fetcher);

  return { data, error, loading: isLoading };
};

export const useBooking = (id: string | null) => {
  const api = useApi();

  const fetcher: Fetcher<Booking, string> = (url) =>
    api.get(url).then((response: BookingResponse) => response.data.booking);

  const { data, error, isLoading } = useSWR(`/bookings/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
