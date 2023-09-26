import { memo } from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useUser } from "@/providers/user";

export const Header = memo(() => {
  const user = useUser();

  const initials = user?.name
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <header className="flex justify-end items-center p-3">
      <Sheet>
        <SheetTrigger>
          <Avatar>
            <AvatarImage />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user?.name}</span>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
});

Header.displayName = "Header";
