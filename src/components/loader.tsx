"use client";

import { PropsWithChildren } from "react";

import { useSDK } from "@twa.js/sdk-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useUser } from "@/providers/user";

export const Loader = ({ children }: PropsWithChildren) => {
  const { didInit, components, error } = useSDK();

  const user = useUser();

  if (!didInit || components === null || !user) {
    return (
      <div className="p-5">
        <Skeleton className="w-[100px] h-[20px] mb-2" />
        <Skeleton className="w-[150px] h-[20px] mb-2" />
        <Skeleton className="w-[75px] h-[20px] mb-2" />
      </div>
    );
  }

  if (error !== null) {
    return (
      <Alert>
        <AlertTitle>Oops</AlertTitle>
        <AlertDescription>Something went wrong...</AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};
