"use client";

import { createContext, useState, useEffect, PropsWithChildren } from "react";

import { supabase } from "@/supabase";
import { useApi } from "@/hooks/useApi";

import type {
  RealtimeChannel,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import { AxiosResponse } from "axios";

import type { User, UserApiResponse } from "@/types";

export const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  const api = useApi();

  useEffect(() => {
    let channel: RealtimeChannel;

    const handleUserUpdate = (payload: RealtimePostgresUpdatePayload<User>) => {
      setUser(payload.new);
    };

    const subscribeToUserProfile = async () => {
      channel = supabase
        .channel("realtime:users")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "users",
          },
          handleUserUpdate
        )
        .subscribe();
    };

    if (!user) {
      api
        .post<UserApiResponse>("/user")
        .then((response: AxiosResponse<UserApiResponse>) => {
          const { user } = response.data;

          if (user) {
            setUser(user);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    if (user) {
      subscribeToUserProfile();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user, api]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
