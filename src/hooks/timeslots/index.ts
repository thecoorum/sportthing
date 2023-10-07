import useSWR, { Fetcher } from "swr";

import { useApi } from "@/hooks/useApi";

import type {
  TimeslotsParams,
  TimeslotsFetcherResponse,
  TimeslotsResponse,
} from "./types";

export const useTimeslots = (params: TimeslotsParams) => {
  const api = useApi();

  const fetcher: Fetcher<
    TimeslotsFetcherResponse,
    { url: string; date: string }
  > = (data) =>
    api
      .post(data.url, params)
      .then((response: TimeslotsResponse) => response.data);

  const { data, error, isLoading } = useSWR(
    { url: "/timeslots", date: params.date },
    fetcher
  );

  return {
    data: data?.timeslots,
    error,
    loading: isLoading,
  };
};
