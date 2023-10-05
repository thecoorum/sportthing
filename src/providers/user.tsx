import { createContext, PropsWithChildren } from "react";
import useSWR, { Fetcher } from "swr";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useApi } from "@/hooks/useApi";

import { ServerCrash } from "lucide-react";

import type { Tables } from "@/database.extensions";

type User = Tables<"users"> & Tables<'employees'>;

interface UserResponse {
  data: {
    user: User;
  };
}

export const UserContext = createContext<User | undefined>(
  undefined
);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const api = useApi();

  const fetcher: Fetcher<User, string> = (url) =>
    api.post(url).then((response: UserResponse) => response.data.user);

  const { data, error, isLoading } = useSWR("/auth", fetcher);

  if (error) {
    return (
      <div className="p-4">
        <Alert>
          <ServerCrash className="w-4 h-4" />
          <AlertTitle>Oops, something went wrong</AlertTitle>
          <AlertDescription>
            There was an error during fetching the user, please try again. If
            the problem persists, please contact the support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        <Skeleton className="w-[100px] h-[20px]" />
        <Skeleton className="w-[150px] h-[20px]" />
        <Skeleton className="w-[75px] h-[20px]" />
      </div>
    );
  }

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};
