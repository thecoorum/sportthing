"use client";

import { PropsWithChildren, createContext } from "react";

import axios, { AxiosInstance } from "axios";
import { useLaunchParams } from "@twa.js/sdk-react";

interface ApiContextInterface {
  get: AxiosInstance["get"];
  post: AxiosInstance["post"];
}

export const ApiContext = createContext<ApiContextInterface>({
  get: () => Promise.resolve({} as any),
  post: () => Promise.resolve({} as any),
});

export const ApiProvider = ({ children }: PropsWithChildren) => {
  const launchParams = useLaunchParams();

  const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Web-App-Data": launchParams.initDataRaw,
    },
  });

  return (
    <ApiContext.Provider
      value={{
        get: (url) => api.get(url),
        post: (url, data) => api.post(url, data),
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
