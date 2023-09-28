import { createContext, PropsWithChildren } from "react";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export const DatabaseContext = createContext<SupabaseClient | undefined>(
  undefined
);

export const DatabaseProvider = ({ children }: PropsWithChildren) => {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  return (
    <DatabaseContext.Provider value={supabase}>
      {children}
    </DatabaseContext.Provider>
  );
};
