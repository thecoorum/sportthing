import { Tables } from "@/database.extensions";

export type Location = Tables<"locations">;

export type LocationsParams = {
  per?: number;
  page?: number;
};

export type LocationResponse = {
  data: {
    location: Tables<"locations">;
  };
};

export type LocationsResponse = {
  data: {
    locations: Tables<"locations">[];
    count: number;
  };
};

export type LocationsFetcherResponse = {
  locations: Tables<"locations">[];
  count: number;
};
