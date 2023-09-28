import { memo } from "react";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";

export const Header = memo(() => {
  return (
    <header className="absolute left-0 top-0 w-full flex justify-end items-center p-3">
      <Sidebar>
        <Button variant="outline" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
      </Sidebar>
    </header>
  );
});

Header.displayName = "Header";
