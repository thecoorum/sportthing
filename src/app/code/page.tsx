"use client";

import { ChevronLeft } from "lucide-react";

import QRCode from "react-qr-code";
import Link from "next/link";

import { useUser } from "@/hooks/useUser";

const Page = () => {
  const user = useUser();

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Link href="/profile" className="flex items-center space-x-1 mb-2">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Profile</span>
        </Link>
        <h2 className="text-3xl font-semibold leading-none tracking-tight">
          Personal code
        </h2>
      </div>
      <div className="p-6">
        <QRCode
          size={256}
          style={{ height: "auto", width: "100%" }}
          value={String(user.id)}
        />
      </div>
    </div>
  );
};

export default Page;
