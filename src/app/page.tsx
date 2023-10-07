"use client";

import { Locations } from "@/features/home/locations";

import { QrCode as QRCodeIcon, ScanLine } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import QRCode from "react-qr-code";
import { DateTime } from "luxon";

import { useUser } from "@/hooks/useUser";
import { useQRScanner, useWebApp } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const user = useUser();

  const router = useRouter();

  const { platform } = useWebApp();
  const scanner = useQRScanner();

  const handleOpenScanner = () => {
    scanner.open().then((result) => {
      scanner.close();
      router.push(`/users?id=${result}`);
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-3">
        <Link href="/profile" className="inline-flex">
          <Avatar name={user.name} className="h-16 w-16" />
        </Link>
        <h2 className="text-md leading-none tracking-tight">
          Welcome, {user.name}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger className="w-full">
            <Button size="lg" variant="outline" className="w-full">
              <QRCodeIcon className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <div className="flex gap-2 items-start pt-6">
              <div className="w-full space-y-2">
                <Avatar name={user.name} className="h-16 w-16" />
                <h3 className="text-lg leading-none tracking-tight">
                  {user.name}
                </h3>
                <div className="flex flex-col space-y-1.5">
                  <span className="text-sm text-muted-foreground tracking-tight leading-none">
                    Member since
                  </span>
                  <span className="text-sm text-muted-foreground tracking-tight leading-none">
                    {DateTime.fromISO(user.created_at || "")
                      .setLocale("en")
                      .toLocaleString({
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                  </span>
                </div>
              </div>
              <div className="px-6 pb-6 relative">
                <span className="absolute left-[-35px] top-[50%] text-sm text-muted-foreground rotate-90">
                  {user.id}
                </span>
                <div className="pt-6">
                  <QRCode
                    size={256}
                    style={{ height: "auto", width: "100%" }}
                    value={String(user.id)}
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {user.role === "administrator" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleOpenScanner}
                  disabled={platform === "web"}
                >
                  <ScanLine className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              {platform === "web" && (
                <TooltipContent>
                  <p className="text-sm text-muted-foreground">
                    QR scanner is not available on web.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Locations />
    </div>
  );
};

export default Page;
