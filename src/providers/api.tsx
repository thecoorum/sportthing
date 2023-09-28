"use client";

import { PropsWithChildren, useEffect, useState, createContext } from "react";

import axios, { AxiosInstance } from "axios";

export const ApiContext = createContext<AxiosInstance>(axios.create());

export const ApiProvider = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));

    setData(params.get("tgWebAppData") || "");
  }, []);

  const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Web-App-Data": data,
    },
  });

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
