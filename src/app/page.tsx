"use client";

import { useEffect, useState } from "react";

import { QrCode as QRCodeIcon, ScanLine } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserCard } from "@/components/ui/user-card";
import { Bookings } from "@/features/home/bookings";
import { Locations } from "@/features/home/locations";
import { Activities } from "@/features/home/activities";

import Link from "next/link";

import { useUser } from "@/hooks/useUser";
import { useCloudStorage, useQRScanner, useWebApp } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const [withScanner, setWithScanner] = useState<boolean>(false);
  const user = useUser();

  const router = useRouter();

  const { platform } = useWebApp();
  const scanner = useQRScanner();
  const cloudStorage = useCloudStorage();

  const { toast } = useToast();

  const handleOpenScanner = () => {
    scanner.open().then((result) => {
      scanner.close();

      if (user.role !== "administrator") {
        toast({
          title: "User scanned",
          description: `You scanned user ${result}, but won't be able to see their profile because of missing permissions.`,
        });
      } else {
        router.push(`/users?id=${result}`);
      }
    });
  };

  useEffect(() => {
    cloudStorage.getValues(["scanner"]).then(({ scanner }) => {
      if (scanner === "enabled") {
        setWithScanner(true);
      }
    });
  }, [cloudStorage]);

  return (
    <div className="space-y-6 p-4">
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
        {(user.role === "administrator" || withScanner) && (
          <TooltipProvider>
            <Button
              size="lg"
              className="w-full"
              onClick={handleOpenScanner}
              disabled={platform === "web"}
            >
              <ScanLine className="w-6 h-6" />
            </Button>
          </TooltipProvider>
        )}
      </div>
      <Bookings />
      <Locations />
      <Activities />
    </div>
  );
};

export default Page;
