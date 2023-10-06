import useSWR, { Fetcher } from "swr";

import { Tables } from "@/database.extensions";
import { useApi } from "./useApi";

type User = Tables<"users"> & Tables<'employees'>

type UserResponse = {
  data: {
    user: User;
  };
};

type UsersResponse = {
  data: {
    users: User[];
  };
};

export const useExternalUsers = () => {
  const api = useApi();

  const fetcher: Fetcher<User[], string> = (url) =>
    api.get(url).then((response: UsersResponse) => response.data.users);

  const { data, error, isLoading } = useSWR("/users", fetcher);

  return { data, error, loading: isLoading };
};

export const useExternalUser = (id: string) => {
  const api = useApi();

  const fetcher: Fetcher<User, string> = (url) =>
    api.get(url).then((response: UserResponse) => response.data.user);

  const { data, error, isLoading } = useSWR(`/users/${id}`, fetcher);

  return { data, error, loading: isLoading };
};
