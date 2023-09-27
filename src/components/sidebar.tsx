import { PropsWithChildren, memo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";

import { useUser } from "@/providers/user";

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
        <div className="flex items-center gap-3 px-3">
          <Avatar className="w-14 h-14">
            <AvatarImage />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {withStatus && (
            <Badge className="py-2 px-4">{STATUS_MAP[user.role]}</Badge>
          )}
        </div>
        <div className="space-y-1 py-2">
          <Link onClick={() => handleOpenChange(false)} href="/">
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
          </Link>
          <Link onClick={() => handleOpenChange(false)} href="/profile">
            <Button variant="ghost" className="w-full justify-start">
              Profile
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
