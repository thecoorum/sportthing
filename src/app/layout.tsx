"use client";

import "./globals.css";

import { Inter } from "next/font/google";
import { SDKProvider } from "@twa.js/sdk-react";

import { Loader } from "@/components/loader";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

import { UserProvider } from "@/providers/user";
import { ApiProvider } from "@/providers/api";
import { DatabaseProvider } from "@/providers/database";

import { cn } from "@/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("h-[100vh]", inter.className)}>
        <SDKProvider>
          <ApiProvider>
            <DatabaseProvider>
              <UserProvider>
                <Loader>
                  <Header />
                  {children}
                  <Toaster />
                </Loader>
              </UserProvider>
            </DatabaseProvider>
          </ApiProvider>
        </SDKProvider>
      </body>
    </html>
  );
}
