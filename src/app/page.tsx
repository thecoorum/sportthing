"use client";

import { Locations } from "@/features/home/locations";

import { Avatar } from "@/components/ui/avatar";

import Link from "next/link";

import { useUser } from "@/hooks/useUser";

const Page = () => {
  const user = useUser();

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
      <Locations />
    </div>
  );
};

export default Page;
