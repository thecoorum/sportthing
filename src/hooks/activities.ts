import { useEffect, useState } from "react";

import { useApi } from "./useApi";

import { Tables } from "@/database.extensions";

export const useActivities = (locationId: string) => {
  const [activities, setActivities] = useState<Tables<"activities">[] | []>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const api = useApi();

  useEffect(() => {
    setLoading(true);

    api
      .get("/activities", {
        params: {
          location_id: locationId,
        },
      })
      .then((response) => {
        const data = response.data as Tables<"activities">[];

        setActivities(data);
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false));
  }, [api, locationId]);

  return { data: activities, error, loading };
};

export const useActivity = (id: string) => {
  const [activity, setActivity] = useState<Tables<"activities"> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const api = useApi();

  useEffect(() => {
    setLoading(true);

    api
      .get("/activities", {
        params: {
          id,
        },
      })
      .then((response) => {
        const data = response.data as Tables<"activities">;

        setActivity(data);
      })
      .catch((error: Error) => setError(error))
      .finally(() => setLoading(false));
  }, [api, id]);

  return { data: activity, error, loading };
};
