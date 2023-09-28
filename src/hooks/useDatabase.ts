import { useContext } from "react";

import { DatabaseContext } from "@/providers/database";

export const useDatabase = () => {
  const context = useContext(DatabaseContext);

  if (context === undefined) {
    throw new Error("useDatabase must be used within an DatabaseProvider");
  }

  return context;
};
