import { NextRequest, NextResponse } from "next/server";

import { verifyInitData } from "@/utils";
import { supabase } from "@/supabase";

export const DELETE = async (req: NextRequest) => {
  const tgWebAppData = req.headers.get("Web-App-Data");

  const { success } = verifyInitData(tgWebAppData);

  const data = await req.json();

  if (success) {
    try {
      const { data: operatingRule, error } = await supabase
        .from("operating_rules")
        .delete()
        .eq("id", data);

      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }

      return NextResponse.json(
        { operating_rule: operatingRule },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  return NextResponse.json(
    { message: "Invalid data provided" },
    { status: 400 }
  );
};
