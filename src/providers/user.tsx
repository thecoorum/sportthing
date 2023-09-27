"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";

import type { User } from "@/types";

export const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user) {
      const headers = new Headers();

      const webAppData = localStorage.getItem("webAppData");

      if (webAppData) {
        headers.set("Web-App-Data", webAppData);
      } else {
        const params = new URLSearchParams(window.location.hash.slice(1));

        localStorage.setItem("webAppData", params.get("tgWebAppData") || "");
        headers.set("Web-App-Data", params.get("tgWebAppData") || "");
      }

      fetch("/api/user", {
        method: "POST",
        headers,
      })
        .then((response) => {
          return response.json();
        })
        .then(({ user }) => {
          setUser(user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
