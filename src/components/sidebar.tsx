import { PropsWithChildren, memo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";

import { useUser } from "@/hooks/useUser";

const STATUS_MAP = {
  admin: "Administrator",
  coach: "Coach",
  user: "User",
};

export const Sidebar = memo(({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState<boolean>(false);

  const user = useUser();

  if (!user) return null;

  const initials = user?.name
    .split(" ")
    .map((name) => name[0])
    .join("");
  const withStatus = ["admin", "coach"].includes(user.role);

  const handleOpenChange = (open: boolean) => setOpen(open);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="p-2">
        <div className="space-y-1 py-8">
          <Link onClick={() => handleOpenChange(false)} href="/" autoFocus={false}>
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
          </Link>
          <Link onClick={() => handleOpenChange(false)} href="/profile" autoFocus={false}>
            <Button variant="ghost" className="w-full justify-start">
              Profile
            </Button>
          </Link>
          <Link onClick={() => handleOpenChange(false)} href="/locations" autoFocus={false}>
            <Button variant="ghost" className="w-full justify-start">
              Locations
            </Button>
          </Link>
          {/* <Button variant="ghost" className="w-full justify-start">
            Activities
          </Button> */}
        </div>
      </SheetContent>
    </Sheet>
  );
});

Sidebar.displayName = "Sidebar";
