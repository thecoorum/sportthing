"use client";

import "./globals.css";

import { Inter } from "next/font/google";
import { SDKProvider } from "@twa.js/sdk-react";

import { Loader } from "@/components/loader";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

import { UserProvider } from "@/providers/user";

import { cn } from "@/utils";
import { ApiProvider } from "@/providers/api";

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
            <UserProvider>
              <Loader>
                <Header />
                {children}
                <Toaster />
              </Loader>
            </UserProvider>
          </ApiProvider>
        </SDKProvider>
      </body>
    </html>
  );
}
