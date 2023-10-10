"use client";

import { Locations } from "@/features/home/locations";

import { QrCode as QRCodeIcon, ScanLine } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserCard } from "@/components/ui/user-card";

import Link from "next/link";

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
        <UserCard>
          <Button size="lg" variant="outline" className="w-full">
            <QRCodeIcon className="w-6 h-6" />
          </Button>
        </UserCard>
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
