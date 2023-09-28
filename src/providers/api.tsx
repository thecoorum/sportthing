"use client";

import { PropsWithChildren, useEffect, createContext } from "react";

import axios, { AxiosInstance } from "axios";

export const ApiContext = createContext<AxiosInstance>(axios.create());

export const ApiProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const webAppData = localStorage.getItem("webAppData");

    if (!webAppData) {
      const params = new URLSearchParams(window.location.hash.slice(1));

      localStorage.setItem("webAppData", params.get("tgWebAppData") || "");
    }
  }, []);

  const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Web-App-Data": localStorage.getItem("webAppData") || "",
    },
  });

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
