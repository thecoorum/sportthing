import { useEffect } from "react";

import { useBackButton as useTgBackButton } from "@twa.js/sdk-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export const useBackButton = () => {
  const router = useRouter();
  const backButton = useTgBackButton();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      backButton.hide();
    } else {
      backButton.show();
      backButton.on("click", () => {
        router.back();
      });
    }

    return () => {
      backButton.off("click");
    };
  }, [pathname]);
};
