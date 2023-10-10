import { Avatar } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import QRCode from "react-qr-code";
import { format } from "date-fns";

import { useUser } from "@/hooks/useUser";
import { useTheme } from "next-themes";

export const UserCard = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const { theme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>
      <SheetContent side="bottom">
        <div className="flex gap-2 items-start pt-6">
          <div className="w-full space-y-2">
            <Avatar name={user.name} className="h-16 w-16" />
            <h3 className="text-lg leading-none tracking-tight">{user.name}</h3>
            <div className="flex flex-col space-y-1.5">
              <span className="text-sm text-muted-foreground tracking-tight leading-none">
                Member since
              </span>
              <span className="text-sm text-muted-foreground tracking-tight leading-none">
                {format(new Date(user.created_at), "MMMM do, yyyy")}
              </span>
            </div>
          </div>
          <div className="p-6 space-y-2 relative">
            <QRCode
              size={256}
              style={{ height: "auto", width: "100%" }}
              value={String(user.id)}
              bgColor={theme === "light" ? "#FFFFFF" : "#020817"}
              fgColor={theme === "light" ? "#020817" : "#FFFFFF"}
            />
            <p className="text-sm text-muted-foreground text-center">
              {user.id}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
