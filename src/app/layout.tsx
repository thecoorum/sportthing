"use client";

import "./globals.css";

import { Inter } from "next/font/google";
import { SDKProvider } from "@twa.js/sdk-react";

import { Header } from "@/components/ui/header";
import { Toaster } from "@/components/ui/toaster";

import { UserProvider } from "@/providers/user";
import { ApiProvider } from "@/providers/api";
import { TermsProvider } from "@/providers/terms";
import { ComponentsProvider } from "@/providers/components";

import { cn } from "@/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <SDKProvider>
          <ComponentsProvider>
            <TermsProvider>
              <ApiProvider>
                <UserProvider>
                  <Header />
                  {children}
                  <Toaster />
                </UserProvider>
              </ApiProvider>
            </TermsProvider>
          </ComponentsProvider>
        </SDKProvider>
      </body>
    </html>
  );
}
