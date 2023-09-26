import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://binqlrncciuajdfxgjya.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbnFscm5jY2l1YWpkZnhnanlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU2MjUzOTQsImV4cCI6MjAxMTIwMTM5NH0.Aw5qCw_vHvz1jQYNqkEsKdtJneZNqjwIUmabBZqD3aU"
);
