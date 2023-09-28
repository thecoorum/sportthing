"use client";

import { PropsWithChildren, createContext } from "react";

import axios, { AxiosInstance } from "axios";
import { useLaunchParams } from "@twa.js/sdk-react";

export const ApiContext = createContext<AxiosInstance>(axios.create());

export const ApiProvider = ({ children }: PropsWithChildren) => {
  const launchParams = useLaunchParams()

  const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Web-App-Data": launchParams.initDataRaw,
    },
  });

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
