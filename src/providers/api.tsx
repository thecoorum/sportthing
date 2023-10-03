"use client";

import { PropsWithChildren, createContext } from "react";

import axios, { AxiosInstance } from "axios";
import { useLaunchParams } from "@twa.js/sdk-react";

interface ApiContextInterface {
  get: AxiosInstance["get"];
  post: AxiosInstance["post"];
  delete: AxiosInstance["delete"];
  patch: AxiosInstance["patch"];
}

export const ApiContext = createContext<ApiContextInterface>({
  get: () => Promise.resolve({} as any),
  post: () => Promise.resolve({} as any),
  delete: () => Promise.resolve({} as any),
  patch: () => Promise.resolve({} as any),
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
        delete: (url) => api.delete(url),
        patch: (url, data) => api.patch(url, data),
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
