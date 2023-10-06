"use client";

import { Locations } from "@/features/home/locations";

import { QrCode as QRCodeIcon, ScanLine } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Link from "next/link";
import QRCode from "react-qr-code";

import { useUser } from "@/hooks/useUser";
import { useQRScanner } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const user = useUser();

  const router = useRouter()

  const scanner = useQRScanner();

  const handleOpenScanner = () => {
    scanner.open().then((result) => {
      scanner.close()
      router.push(`/users?id=${result}`)
    })
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-md leading-none tracking-tight">
          Welcome, {user.name}
        </h2>
        <Link href="/profile">
          <Avatar name={user.name} />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger className="w-full">
            <Button variant="outline" className="w-full">
              <QRCodeIcon className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex items-center justify-center">
            <div className="p-6">
              <QRCode
                size={256}
                style={{ height: "auto", width: "100%" }}
                value={String(user.id)}
              />
            </div>
          </SheetContent>
        </Sheet>
        {user.role === "administrator" && (
          <Button className="w-full" onClick={handleOpenScanner}>
            <ScanLine className="w-6 h-6" />
          </Button>
        )}
      </div>
      <Locations />
    </div>
  );
};

export default Page;
