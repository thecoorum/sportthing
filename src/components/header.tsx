import { memo } from "react";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useUser } from "@/providers/user";

const STATUS_MAP = {
  admin: "Administrator",
  coach: "Coach",
  user: "User",
};

export const Header = memo(() => {
  const user = useUser();

  if (!user) return null;

  const initials = user?.name
    .split(" ")
    .map((name) => name[0])
    .join("");
  const withStatus = ["admin", "coach"].includes(user.role);

  return (
    <header className="flex justify-end items-center p-3">
      <Sheet>
        <SheetTrigger>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14">
              <AvatarImage />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">{user.name}</span>
              {withStatus && <Badge>{STATUS_MAP[user.role]}</Badge>}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
});

Header.displayName = "Header";
