"use client";

import { Locations } from "@/features/home/locations";

import { useUser } from "@/hooks/useUser";

const Page = () => {
  const user = useUser();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-md leading-none tracking-tight">
        Welcome, {user.name}
      </h2>
      <Locations />
    </div>
  );
};

export default Page;
